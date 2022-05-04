import {
  Tabs,
  Tab,
  Typography,
  Paper,
  TextField,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Select,
  MenuItem,
  TablePagination,
} from "@mui/material";
import { Box } from "@mui/system";
import { useState, ReactNode, useEffect, ChangeEvent, MouseEvent } from "react";
import { useForm } from "react-hook-form";
import { LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import { DatePicker } from "@mui/lab";
import { User } from "../models/User";
import { Venta } from "../models/Ventas";
import UserService from "../services/User.Service";
import VentaService from "../services/Ventas.Service";
import { Producto } from "../models/Producto";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import ProductoService from "../services/ProductoService";
import VentasProductoService from "../services/VentasProductos.Service";

ChartJS.register(ArcElement, Tooltip, Legend);

const Reportes = () => {
  const [value, setValue] = useState<number>(-1);
  require("./css/reportes.css");

  interface TabPanelProps {
    children?: ReactNode;
    index: number;
    value: number;
  }

  useEffect(() => {
    localStorage.setItem("lastPage", "reportes");
    let lastReport = localStorage.getItem("lastReport");

    if (lastReport) {
      if (lastReport == "ventas") setValue(0);
      if (lastReport == "productos") setValue(1);
    }
  });

  function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Ventas" {...a11yProps(0)} />
          <Tab label="Productos" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <VentasTabla />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ProductosTabla />
      </TabPanel>
    </>
  );

  function VentasTabla() {
    const [ventas, setVentas] = useState<Array<Venta>>([]);
    const [usuarios, setUsuarios] = useState<Array<User>>([]);
    const [user, setUser] = useState("0");
    const [total, setTotal] = useState(0);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(0);
    const [date, setDate] = useState<Date | null>(new Date());

    const { control, handleSubmit, reset } = useForm({
      defaultValues: {
        nombre: "",
        fecha: "",
      },
    });

    const requestSearch = async (id: number) => {
      if (id == 0) {
        if (date != undefined) {
          await VentaService.list(limit, page * limit).then((response) => {
            const filteredRows = response.ventas.filter((row) => {
              let fecha = row.fecha.split("T");
              let dia = fecha[0];
              let dateComparison =
                date.getFullYear().toString() +
                " " +
                (date.getMonth() + 1).toString() +
                " " +
                date.getDay().toString();
              const d1 = new Date(dateComparison);
              console.log("d1" + d1);
              const d2 = new Date(dia);
              console.log("d2" + d2);

              return (
                d1.getDay() == d2.getDay() &&
                d1.getMonth() == d2.getMonth() &&
                d1.getFullYear() == d2.getFullYear()
              );
            });
            setTotal(filteredRows.length);
            setVentas(filteredRows);
          });
        } else {
          loadUsuarios();
        }
      } else {
        await VentaService.list(limit, page * limit).then((response) => {
          setVentas(response.ventas);
          setTotal(response.total);
          if (date == undefined) {
            const filteredRows = response.ventas.filter((row) => {
              return row.usuarioId === id;
            });
            setTotal(filteredRows.length);
            setVentas(filteredRows);
          } else {
            const filteredRows = response.ventas.filter((row) => {
              let fecha = row.fecha.split("T");
              let dia = fecha[0];
              let dateComparison =
                date.getFullYear().toString() +
                " " +
                (date.getMonth() + 1).toString() +
                " " +
                date.getDay().toString();
              const d1 = new Date(dateComparison);
              const d2 = new Date(dia);
              return (
                d1.getDay() == d2.getDay() &&
                d1.getMonth() == d2.getMonth() &&
                d1.getFullYear() == d2.getFullYear() &&
                row.usuarioId === id
              );
            });
            setTotal(filteredRows.length);
            setVentas(filteredRows);
          }
        });
      }
    };

    useEffect(() => {
      loadUsuarios();
      localStorage.setItem("lastReport", "ventas");
    }, [page, limit]);

    const loadUsuarios = async () => {
      try {
        const resultsUser = await UserService.list(50, 0);
        setUsuarios(resultsUser.users);
        const resultsVentas = await VentaService.list(limit, page * limit);
        setVentas(resultsVentas.ventas);
        setTotal(resultsVentas.total);
      } catch (e) {
        console.log(e);
      } finally {
      }
    };

    const onSubmitVentas = async (form: any) => {
      try {
        requestSearch(parseInt(user));
      } catch (e) {
        console.log(e);
      } finally {
      }
    };

    const handleChangePage = (
      event: MouseEvent<HTMLButtonElement> | null,
      newPage: number
    ) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (
      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      setLimit(parseInt(event.target.value, 10));
      setPage(0);
    };

    return (
      <Paper>
        <form onSubmit={handleSubmit(onSubmitVentas)}>
          <Paper
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              height: "80px",
            }}
          >
            <div>
              <Typography variant="overline" style={{ marginRight: "10px" }}>
                Nombre
              </Typography>
              <Select
                label="Usuario"
                value={user}
                onChange={(e) => {
                  setUser(e.target.value);
                }}
              >
                {usuarios.map((usuario, index) => (
                  <MenuItem key={index} value={usuario.id}>
                    {usuario.nombre}
                  </MenuItem>
                ))}
              </Select>
            </div>
            <div>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                {console.log(date)}
                <DatePicker
                  label="Fecha de venta"
                  value={date}
                  onChange={(e) => {
                    setDate(e);
                  }}
                  renderInput={(props) => <TextField {...props} />}
                />
              </LocalizationProvider>
            </div>
            {/* <div>
              <FormGroup>
                <FormControlLabel
                  control={<Switch />}
                  label={mayor ? "Mayor a menor" : "Menor a mayor"}
                  value={mayor}
                  onChange={(e) => {
                    setMayor(!mayor);
                  }}
                />
              </FormGroup>
            </div> */}
            <div>
              <Button
                variant="contained"
                // disabled={}
                type="submit"
              >
                Buscar
              </Button>
            </div>
            <div>
              <Button
                variant="outlined"
                color="error"
                onClick={(e) => {
                  loadUsuarios();
                  setDate(new Date());
                  setUser("");
                }}
              >
                Reiniciar
              </Button>
            </div>
          </Paper>
        </form>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Venta</TableCell>
                <TableCell>Usuario</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ventas.map((venta, index) => {
                let fecha = venta.fecha.split("T");
                let dia = fecha[0];
                let split1 = fecha[1].split(".");
                let hora = split1[0];
                return (
                  <TableRow key={index + "+" + (venta.id ? venta.id : 123)}>
                    <TableCell>{dia + " " + hora}</TableCell>
                    <TableCell>$ {venta.total}</TableCell>
                    <TableCell>
                      {usuarios.map((usuario, index) =>
                        usuario.id === venta.usuarioId ? usuario.nombre : null
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={limit}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    );
  }

  function ProductosTabla() {
    const [ventas, setVentas] = useState<Array<Venta>>([]);
    const [productos, setProductos] = useState<Array<Producto>>([]);
    const [productosNombre, setProductosNombre] = useState<Array<String>>([]);
    const [ventasProductosArr, setVentasProductosArr] = useState<Array<number>>(
      []
    );

    useEffect(() => {
      loadUsuarios();
      localStorage.setItem("lastReport", "productos");
    }, []);

    const placeOnlyUniqueId = (
      array: Array<number>,
      arrayProd: Array<number>
    ) => {
      let arr = [];
      let contador = 0;
      for (let i = 0; i < arrayProd.length; i++) {
        contador = 0;
        for (let j = 0; j < array.length; j++) {
          if (array[j] == arrayProd[i]) {
            contador++;
          }
        }
        arr.push(contador);
      }
      console.log(arr);
      setVentasProductosArr(arr);
    };

    const loadUsuarios = async () => {
      try {
        const resultProductos = await ProductoService.list(200, 0);
        const resultVentasProductos = await VentasProductoService.getAll();
        const arr = Array<number>();
        const arrProd = Array<number>();

        resultProductos.productos.forEach((producto) => {
          productosNombre.push(producto.nombre);
          arrProd.push(producto.id);
        });
        setProductos(resultProductos.productos);

        resultVentasProductos.ventasProductos.forEach((ventaProducto) => {
          arr.push(ventaProducto.productoId);
        });
        placeOnlyUniqueId(arr, arrProd);
      } catch (e) {
        console.log(e);
      } finally {
      }
    };

    const data = {
      labels: productosNombre,
      datasets: [
        {
          label: "# of Votes",
          data: ventasProductosArr,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };

    return (
      <>
        <Typography variant="subtitle1">
          Histórico de Productos Vendidos
        </Typography>

        <div>
          <Pie
            className="pie"
            data={data}
            height={500}
            width={600}
            options={{ maintainAspectRatio: false }}
          />
        </div>
      </>
    );
  }
};

export default Reportes;
