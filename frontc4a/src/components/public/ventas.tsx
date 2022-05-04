import {
  alpha,
  AppBar,
  Box,
  Button,
  Chip,
  Collapse,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  styled,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import { AuthContext, IAuthContext } from "../context/AuthContext";
import InputBase from "@mui/material/InputBase";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Fragment, useContext, useEffect, useState } from "react";
import { IProducto, Producto } from "../models/Producto";
import ProductoService from "../services/ProductoService";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { IInsumoProducto, InsumoProducto } from "../models/InsumoProducto";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import InsumoService from "../services/Insumos.Service";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { IVentasInsumo } from "../models/VentasInsumos";
import { IVenta } from "../models/Ventas";
import { User, IUser } from "../models/User";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import VentaService from "../services/Ventas.Service";
import { IInsumo } from "../models/Insumo";
import { useNavigate } from "react-router-dom";
type Anchor = "top" | "left" | "bottom" | "right";

const VentasPanel = () => {
  require("./ventas.css");
  const [search, setSearch] = useState("");
  const [productos, setProductos] = useState<Array<Producto>>([]);
  const [producto, setProducto] = useState<Producto | undefined>();
  const [addProducto, setAddProducto] = useState(false);
  const [insumos, setInsumos] = useState<Array<IInsumo>>([]);
  const [productosVenta, setProductosVenta] = useState<Array<Producto>>([]);
  const [remove, setRemove] = useState(false);
  const [index, setIndex] = useState(-1);
  const [cobrar, setCobrar] = useState(false);
  const [total, setTotal] = useState(0);
  const [cancelar, setCancelar] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | undefined>();
  const [insumoProductos, setInsumoProductos] = useState<
    Array<IInsumoProducto>
  >([]);
  let navigate = useNavigate();

  const { logout } = useContext(AuthContext) as IAuthContext;

  const keyUpHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === "Backspace") {
      loadProductos();
      requestSearch(search);
    }
    if (event.code === "Escape") {
      setSearch("");
      loadProductos();
    }
  };

  const requestSearch = (searchedVal: string) => {
    if (searchedVal == "") {
      loadProductos();
    } else {
      const filteredRows = productos.filter((row) => {
        return row.nombre.toLowerCase().includes(searchedVal.toLowerCase());
      });

      setProductos(filteredRows);
    }
  };

  useEffect(() => {
    let user = localStorage.getItem("currentUser");
    if (user) {
      const newCurrentUser = JSON.parse(user) as IUser;
      setCurrentUser(new User(newCurrentUser));
    }
  }, []);

  const calculoTotal = () => {
    let suma = 0;
    productosVenta.forEach((producto) => {
      suma += producto.precio;
    });
    setTotal(suma);
  };

  const cancelSearch = () => {
    setSearch("");
    requestSearch(search);
  };

  useEffect(() => {
    loadProductos();
    if (search === "") {
      cancelSearch();
    }
  }, []);

  useEffect(() => {
    calculoTotal();
  }, [productosVenta]);

  const loadProductos = async () => {
    try {
      const resultsInsumo = await InsumoService.getAll();
      setInsumos(resultsInsumo.insumos);
      const results = await ProductoService.getAll();
      setProductos(results.productos);
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  return (
    <>
      <Paper style={{ height: "100%" }}>
        <TemporaryDrawer />
        <Paper
          elevation={3}
          style={{
            display: "relative",
            marginTop: "10px",
            marginBottom: "10px",
            marginLeft: "10px",
          }}
        >
          Bienvenid@ {currentUser?.nombre}
        </Paper>
        <div className="tables" style={{ height: "80%" }}>
          <div className="table-responsive">
            <TableContainer component={Paper} sx={{ height: "100%" }}>
              <Table
                sx={{ minWidth: 650 }}
                stickyHeader
                aria-label="sticky table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Extras</TableCell>
                    <TableCell>Producto</TableCell>
                    <TableCell>Precio Unitario</TableCell>
                    <TableCell>Eliminar</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productosVenta.map((producto, index) => (
                    <>
                      <Row producto={producto} index={index} key={index}></Row>
                    </>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <Paper className="paper">
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  requestSearch(e.target.value);
                }}
                onKeyUp={keyUpHandler}
                placeholder="Buscar.."
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 100 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Precio</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {productos.map((producto, index) => (
                    <>
                      <TableRow
                        key={index + producto.nombre}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                        onClick={() => {
                          setProducto(producto);
                          setAddProducto(true);
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {producto.nombre}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {"$" + producto.precio}
                          <Button style={{ float: "right" }}>
                            <FontAwesomeIcon icon={faPlus} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    </>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </div>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            "& > :not(style)": {
              width: "17%",
              height: 70,
            },
          }}
        >
          <Paper elevation={1}>
            <Typography
              variant="subtitle2"
              style={{ marginLeft: "30px", paddingTop: "22px" }}
            >
              Total: $ {total}
            </Typography>
          </Paper>
          <Paper elevation={3}>
            <Button
              color="error"
              size="large"
              disabled={total === 0}
              onClick={() => {
                setCancelar(true);
              }}
              style={{
                display: "block",
                marginRight: "auto",
                marginLeft: "auto",
                marginTop: "15px",
              }}
              variant="outlined"
            >
              Cancelar
            </Button>
          </Paper>
          <Paper elevation={1}>
            <Typography
              variant="subtitle2"
              style={{ marginLeft: "30px", paddingTop: "22px" }}
            ></Typography>
          </Paper>
          <Paper elevation={3}>
            <Button
              color="primary"
              size="large"
              disabled={total === 0}
              onClick={() => {
                setCobrar(true);
              }}
              style={{
                display: "block",
                marginRight: "auto",
                marginLeft: "auto",
                marginTop: "15px",
              }}
              variant="outlined"
            >
              Cobrar
            </Button>
          </Paper>
        </Box>
        {
          <CobroDialog
            onClose={() => {
              setCobrar(false);
            }}
            open={cobrar}
          />
        }
        {
          <CancelarDialog
            close={() => {
              setCancelar(false);
            }}
            open={cancelar}
          />
        }
        {producto && (
          <ProductoDialog
            key={`${producto.id}update`}
            producto={producto}
            onClose={() => {
              setAddProducto(false);
            }}
            open={addProducto}
            onCreate={loadProductos}
            insumos={insumos}
          />
        )}
        {producto && (
          <DeleteDialog
            key={`${producto.id}delete`}
            producto={producto}
            close={() => {
              setRemove(false);
            }}
            open={remove}
            onCreate={loadProductos}
          />
        )}
      </Paper>
    </>
  );

  function ProductoDialog({
    open,
    onClose,
    onCreate,
    insumos,
    producto,
  }: {
    open: boolean;
    onClose: () => void;
    onCreate: () => void;
    insumos: Array<IInsumo>;
    producto: Producto;
  }) {
    const [loading, setLoading] = useState(false);
    const [insumo, setInsumo] = useState("");
    const [medicion, setMedicion] = useState("no hay");
    const [idProducto, setIdProducto] = useState(-1);
    const [tempInsumoProductos, setTempInsumoProductos] = useState<
      Array<IInsumoProducto>
    >([]);

    const { control, handleSubmit, reset, setValue } = useForm({
      defaultValues: {
        cantidad: 0,
        insumos: Array<IInsumoProducto>(),
      },
    });

    const setId = () => {
      const d = new Date();
      let hour = d.getHours();
      let minutes = d.getMinutes();
      let seconds = d.getSeconds();

      const idProducto = parseInt(
        producto.id + "" + hour + "" + minutes + "" + seconds
      );
      setIdProducto(idProducto);
    };

    useEffect(() => {
      setId();
    }, []);

    const onChangeMedicion = (id: any) => {
      insumos.forEach((insumoFor) => {
        if (insumoFor.id === id) {
          setMedicion(insumoFor.medicion);
        }
      });
    };

    const onAddClick = () => {
      if (insumo == "") {
        toast.error("Introduzca todos los datos para agregar un insumo");
      } else {
        let newInsumoProductos = {
          insumoId: parseInt(insumo),
          productoVentaId: idProducto,
        } as IInsumoProducto;
        tempInsumoProductos.push(new InsumoProducto(newInsumoProductos));
        setInsumo("");
      }
    };

    const onSubmit = async (form: any) => {
      try {
        setLoading(true);
        let tempTotal = total;
        tempTotal += producto.precio;
        setTotal(tempTotal);
        producto.idVenta = idProducto;
        productosVenta.push(producto);
        if (tempInsumoProductos) {
          tempInsumoProductos.forEach((producto) => {
            insumoProductos.push(producto);
          });
        }
        let productos = productosVenta;
        setProductosVenta(productos);
        setTempInsumoProductos([]);
        onClose();
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    return (
      <Dialog open={open} onClose={onClose} fullWidth>
        <AppBar position="static" elevation={1} style={{ padding: 10 }}>
          <Box sx={{ display: "flex" }}>
            <Typography variant="h6">Producto</Typography>
            <Box sx={{ flexGrow: 10 }} />
            <IconButton
              style={{ color: "white" }}
              onClick={onClose}
            ></IconButton>
          </Box>
        </AppBar>
        <Container maxWidth="lg" style={{ marginBottom: 15 }}>
          <Paper variant="outlined" style={{ padding: 20, marginTop: 20 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Typography
                variant="h4"
                style={{ marginTop: 20, marginBottom: 20 }}
                textAlign="center"
              >
                Agregar Producto
              </Typography>
              <div style={{ marginBottom: 15 }}>
                <Typography variant="subtitle2">Nombre</Typography>
                <Chip label={producto.nombre} variant="outlined" />
              </div>
              <div style={{ marginBottom: 10 }}>
                <Typography variant="subtitle2">Precio</Typography>
                <Chip label={"$ " + producto.precio} variant="outlined" />
              </div>
              <div style={{ marginBottom: 10 }}>
                <Typography variant="subtitle2">Extras</Typography>
                <Typography variant="overline">Agregue un extra</Typography>
                <Select
                  style={{ width: "40%", margin: "10px" }}
                  value={insumo}
                  onChange={(e) => {
                    setInsumo(e.target.value);
                    onChangeMedicion(e.target.value);
                  }}
                >
                  {insumos.map((insumo, index) => (
                    <MenuItem key={index} value={insumo.id}>
                      {insumo.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </div>

              {tempInsumoProductos.map((insumoProducto, index1) =>
                insumos.map((insumo, index2) =>
                  insumo.id == insumoProducto.insumoId ? (
                    <Chip
                      id="insumoDiv"
                      label={insumo.nombre}
                      key={index1 + "insumoProducto" + index2}
                      onClick={() => {
                        delete insumoProductos[index1];
                        let insumosProductosNew: Array<IInsumoProducto> = [];
                        tempInsumoProductos.forEach((insumoProducto) => {
                          if (insumo == null) {
                          } else {
                            insumosProductosNew.push(insumoProducto);
                          }
                        });
                        setInsumoProductos([]);
                        setInsumoProductos(insumosProductosNew);
                      }}
                    ></Chip>
                  ) : null
                )
              )}
              <br />
              <Typography variant="caption">
                Dé click al extra para eliminarlo
              </Typography>
              <br />
              <Button
                variant="contained"
                sx={{ my: 2 }}
                disabled={loading}
                onClick={() => {
                  onAddClick();
                }}
              >
                Agregar extra
              </Button>
              <div style={{ marginBottom: 15 }}>
              </div>
              <Grid container justifyContent="end">
                <Button
                  sx={{ my: 2 }}
                  onClick={() => {
                    reset();
                    setInsumo("");
                    setInsumoProductos([]);
                    onClose();
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  sx={{ my: 2 }}
                  type="submit"
                  disabled={loading}
                >
                  Agregar
                </Button>
              </Grid>
            </form>
          </Paper>
        </Container>
      </Dialog>
    );
  }

  function CobroDialog({
    open,
    onClose,
  }: {
    open: boolean;
    onClose: () => void;
  }) {
    const [loading, setLoading] = useState(false);
    const [cambio, setCambio] = useState(0);
    const [pago, setPago] = useState(0);

    const { control, handleSubmit, reset, setValue } = useForm({
      defaultValues: {
        cantidad: 0,
        insumos: Array<IInsumoProducto>(),
      },
    });

    useEffect(() => {
      calcularCambio();
    }, [pago]);

    const calcularCambio = () => {
      let tempCambio = pago - total;
      setCambio(tempCambio);
    };

    const onSubmit = async (form: any) => {
      try {
        if (pago == 0) {
          toast.error("Seleccione el pago porfavor");
        }

        setLoading(true);

        let ventasInsumos: Array<IVentasInsumo> = [];

        insumoProductos.forEach((insumoProducto) => {
          let newVentasInsumos = {
            insumoId: insumoProducto.insumoId,
          } as IVentasInsumo;
          ventasInsumos.push(newVentasInsumos);
        });

        const d = new Date();

        let newVenta = {
          insumos: ventasInsumos,
          productos: productosVenta,
          usuarioId: currentUser?.id,
          fecha: d.toLocaleDateString(),
          nombre: (d.getDate() + total).toString(),
          total: total,
        } as IVenta;

        console.log(newVenta);

        const promise = VentaService.create(newVenta)
          .then((response) => {
            setInsumoProductos([]);
            setProductosVenta([]);
            toast.success("Éxito al crear venta");
            onClose();
          })
          .catch((err) => {
            toast.error("Error al crear venta");
            console.log(err);
          });

        toast.promise(promise, {
          pending: "Espere por favor..",
        });
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    return (
      <Dialog open={open} onClose={onClose} fullWidth>
        <AppBar position="static" elevation={1} style={{ padding: 10 }}>
          <Box sx={{ display: "flex" }}>
            <Typography variant="h6">Cobro</Typography>
            <Box sx={{ flexGrow: 10 }} />
            <IconButton
              style={{ color: "white" }}
              onClick={onClose}
            ></IconButton>
          </Box>
        </AppBar>
        <Container maxWidth="lg" style={{ marginBottom: 15 }}>
          <Paper variant="outlined" style={{ padding: 20, marginTop: 20 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Typography
                variant="h4"
                style={{ marginTop: 20, marginBottom: 20 }}
                textAlign="center"
              >
                Cobra al cliente
              </Typography>
              <div style={{ marginBottom: 15 }}>
                <Typography variant="subtitle2">Total</Typography>
                <Chip label={total} variant="outlined" />
              </div>
              <div style={{ marginBottom: 10 }}>
                <Typography variant="subtitle2">Paga con</Typography>
                <Chip
                  label={5}
                  variant="outlined"
                  onClick={(e) => {
                    let tempPago = pago;
                    tempPago += 5;
                    setPago(tempPago);
                  }}
                />
                <Chip
                  label={10}
                  variant="outlined"
                  onClick={(e) => {
                    let tempPago = pago;
                    tempPago += 10;
                    setPago(tempPago);
                  }}
                />
                <Chip
                  label={20}
                  variant="outlined"
                  onClick={(e) => {
                    let tempPago = pago;
                    tempPago += 20;
                    setPago(tempPago);
                  }}
                />
                <Chip
                  label={50}
                  variant="outlined"
                  onClick={(e) => {
                    let tempPago = pago;
                    tempPago += 50;
                    setPago(tempPago);
                  }}
                />
                <Chip
                  label={100}
                  variant="outlined"
                  onClick={(e) => {
                    let tempPago = pago;
                    tempPago += 100;
                    setPago(tempPago);
                  }}
                />
                <Chip
                  label={200}
                  variant="outlined"
                  onClick={(e) => {
                    let tempPago = pago;
                    tempPago += 200;
                    setPago(tempPago);
                  }}
                />
                <Chip
                  label={500}
                  variant="outlined"
                  onClick={(e) => {
                    let tempPago = pago;
                    tempPago += 500;
                    setPago(tempPago);
                  }}
                />
                <Chip
                  label={1000}
                  variant="outlined"
                  onClick={(e) => {
                    let tempPago = pago;
                    tempPago += 1000;
                    setPago(tempPago);
                  }}
                />
                <Chip
                  label="Exacto"
                  variant="outlined"
                  onClick={(e) => {
                    let tempPago = pago;
                    tempPago += total;
                    setPago(tempPago);
                  }}
                />
                <br />
              </div>
              <div style={{ marginBottom: 10 }}>
                <Typography variant="subtitle2">Pago</Typography>
                <Chip
                  label={pago}
                  variant="outlined"
                  onClick={(e) => {
                    let tempPago = pago;
                    tempPago += total;
                    setPago(tempPago);
                  }}
                />
                <br />
                <Button
                  variant="outlined"
                  sx={{ my: 2 }}
                  onClick={(e) => {
                    setPago(0);
                  }}
                  disabled={loading}
                >
                  Corregir
                </Button>
              </div>
              <div style={{ marginBottom: 10 }}>
                <Typography variant="subtitle2">Cambio</Typography>
                <br />
                <Typography variant="overline">{cambio}</Typography>
              </div>
              <Grid container justifyContent="end">
                <Button
                  sx={{ my: 2 }}
                  onClick={() => {
                    reset();
                    setInsumoProductos([]);
                    onClose();
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  sx={{ my: 2 }}
                  type="submit"
                  disabled={loading}
                >
                  Aceptar
                </Button>
              </Grid>
            </form>
          </Paper>
        </Container>
      </Dialog>
    );
  }

  function DeleteDialog({
    producto,
    open,
    close,
    onCreate,
  }: {
    producto: IProducto;
    open: boolean;
    close: () => void;
    onCreate: () => void;
  }) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
      try {
        setLoading(true);
        let tempTotal = total;
        tempTotal -= productosVenta[index].precio;
        setTotal(tempTotal);
        delete productosVenta[index];

        close();
        onCreate();
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    return (
      <Dialog open={open} onClose={close} fullWidth>
        <DialogTitle>¿Estás seguro? </DialogTitle>
        <DialogContent style={{ padding: 20 }}>
          <Typography variant="body1" style={{ fontWeight: 400 }}>
            El Producto {producto.nombre} sera eliminado PERMANENTEMENTE junto
            con sus datos
          </Typography>
        </DialogContent>
        <DialogActions style={{ marginTop: 10 }}>
          <Button onClick={close}>Cancelar</Button>
          <Button variant="contained" disabled={loading} onClick={handleDelete}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  function CancelarDialog({
    close,
    open,
  }: {
    open: boolean;
    close: () => void;
  }) {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
      try {
        setLoading(true);
        setProductosVenta([]);
        setInsumoProductos([]);

        close();
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };

    return (
      <Dialog open={open} onClose={close} fullWidth>
        <DialogTitle>¿Estás seguro? </DialogTitle>
        <DialogContent style={{ padding: 20 }}>
          <Typography variant="body1" style={{ fontWeight: 400 }}>
            Todos los productos serán eliminado PERMANENTEMENTE junto con sus
            datos
          </Typography>
        </DialogContent>
        <DialogActions style={{ marginTop: 10 }}>
          <Button onClick={close}>Cancelar</Button>
          <Button variant="contained" disabled={loading} onClick={handleDelete}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  function Row({ producto, index }: { producto: Producto; index: number }) {
    const [open, setOpen] = useState(false);

    return (
      <>
        <TableRow
          key={`${producto.id}${index}user`}
          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        >
          <TableCell component="th" scope="row">
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>

          <TableCell component="th" scope="row">
            {producto.nombre}
          </TableCell>
          <TableCell component="th" scope="row">
            $ {producto.precio}
          </TableCell>
          <TableCell component="th" scope="row">
            <Button
              color="error"
              size="small"
              onClick={() => {
                setProducto(producto);
                setIndex(index);
                setRemove(true);
              }}
              style={{
                marginLeft: 2,
              }}
              variant="outlined"
            >
              Eliminar
            </Button>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Extras
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Extra</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {insumoProductos.map((insumoProducto, index) => (
                      <>
                        {insumoProducto.productoVentaId === producto.idVenta ? (
                          <TableRow key={index}>
                            <TableCell component="th" scope="row">
                              {insumos.map((insumo, index) => (
                                <>
                                  {insumo.id == insumoProducto.insumoId
                                    ? insumo.nombre
                                    : null}
                                </>
                              ))}
                            </TableCell>
                          </TableRow>
                        ) : null}
                      </>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </>
    );
  }

  function TemporaryDrawer() {
    const [state, setState] = useState({
      top: false,
      left: false,
      bottom: false,
      right: false,
    });

    const toggleDrawer =
      (anchor: Anchor, open: boolean) =>
      (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
          event.type === "keydown" &&
          ((event as React.KeyboardEvent).key === "Tab" ||
            (event as React.KeyboardEvent).key === "Shift")
        ) {
          return;
        }

        setState({ ...state, [anchor]: open });
      };

    const salir = () => {
      logout();
      navigate("/");
    };

    const list = (anchor: Anchor) => (
      <Box
        color={"primary"}
        sx={{ width: 250 }}
        role="presentation"
        onClick={toggleDrawer(anchor, false)}
        onKeyDown={toggleDrawer(anchor, false)}
      >
        <List>
          {currentUser?.rol ? (
            currentUser?.rol == "User" ? null : (
              <ListItem
                button
                onClick={(e) => {
                  navigate("/");
                }}
              >
                <ListItemText primary={"Dashboard"} />
                <ListItemIcon>
                  <HomeOutlinedIcon />
                </ListItemIcon>
              </ListItem>
            )
          ) : null}
        </List>
        <Divider />
        <ListItem button onClick={salir} >
          <ListItemText primary={"Salir"} />
          <ListItemIcon>
            <ExitToAppOutlinedIcon />
          </ListItemIcon>
        </ListItem>
      </Box>
    );

    return (
      <Paper>
        {(["left"] as const).map((anchor) => (
          <Fragment key={anchor}>
            <Button color="primary" onClick={toggleDrawer(anchor, true)}>
              <MenuOutlinedIcon />
            </Button>
            <Drawer
              anchor={anchor}
              open={state[anchor]}
              onClose={toggleDrawer(anchor, false)}
            >
              {list(anchor)}
            </Drawer>
          </Fragment>
        ))}
      </Paper>
    );
  }
};

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "20%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default VentasPanel;
