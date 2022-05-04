import "bootstrap/dist/css/bootstrap.css";
import {
  useEffect,
  useState,
  MouseEvent,
  ChangeEvent,
  forwardRef,
  ReactElement,
  Ref,
} from "react";
import { Controller, useForm } from "react-hook-form";
import { IProveedor, Proveedor } from "../models/Proveedor";
import { IInsumoProveedor, InsumoProveedor } from "../models/InsumoProveedor";
import ProveedorService from "../services/Proveedor.Service";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  AppBar,
  Box,
  IconButton,
  Slide,
  Container,
  MenuItem,
  Select,
} from "@mui/material";
import { toast } from "react-toastify";
import InsumoProveedorService from "../services/InsumoProveedor.Service";
import { IInsumo } from "../models/Insumo";
import InsumoService from "../services/Insumos.Service";

const ProveedorList = () => {
  const [proveedores, setProveedores] = useState<Array<Proveedor>>([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [proveedor, setProveedor] = useState<Proveedor | undefined>();
  const [insumosProveedores, setInsumosProveedores] = useState<
    Array<IInsumoProveedor>
  >([]);
  const [insumos, setInsumos] = useState<Array<IInsumo>>([]);
  const [remove, setRemove] = useState(false);
  const [update, setUpdate] = useState(false);
  const [prod, setProd] = useState(false);
  require("./css/productoList.css");

  useEffect(() => {
    loadProveedores();
    localStorage.setItem("lastPage", "proveedores");
  }, [prod, page, limit]);

  const loadProveedores = async () => {
    try {
      const resultsProd = await ProveedorService.list(limit, page * limit);
      const resultsInsumoProv = await InsumoProveedorService.getAll();
      const resultsInsumo = await InsumoService.getAll();
      console.log(resultsInsumoProv);
      setInsumosProveedores(resultsInsumoProv.InsumoProveedores);
      setProveedores(resultsProd.proveedores);
      setTotal(resultsProd.total);
      setInsumos(resultsInsumo.insumos);
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
    <div className="content-wrapper">
      <div className="content-header">
        <div className="row justify-content-between">
          <div className="col-6">
            <h2 className="myaccount-content">Proveedores registrados</h2>
          </div>
          <div className="col-3-2">
            <Button
              color="primary"
              size="small"
              onClick={() => {
                setProd(true);
              }}
              style={{
                float: "right",
                marginRight: "10px",
                marginBottom: "10px",
              }}
              variant="outlined"
            >
              Crear Proveedor
            </Button>
          </div>
        </div>
      </div>

      <div className="table-responsive">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Telefono</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Insumos</TableCell>
                <TableCell>Editar</TableCell>
                <TableCell>Eliminar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {proveedores.map((proveedor, index) => (
                <TableRow
                  key={`${proveedor.id}${index}user`}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {proveedor.nombre}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {proveedor.telefono}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {proveedor.email}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {insumosProveedores.map((insumoProveedor, index) =>
                      insumos.map((insumo, index) => (
                        <p key={index + "insumo"}>
                          {insumoProveedor.proveedorId == proveedor.id &&
                          insumoProveedor.insumoId == insumo.id
                            ? insumo.nombre +
                              " " +
                              insumoProveedor.cantidad +
                              " " +
                              insumo.medicion +
                              " $" +
                              insumoProveedor.precio +
                              " MXN"
                            : null}
                        </p>
                      ))
                    )}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <Button
                      color="secondary"
                      size="small"
                      onClick={() => {
                        setProveedor(proveedor);
                        setUpdate(true);
                      }}
                      style={{
                        marginLeft: 2,
                      }}
                      variant="outlined"
                    >
                      Editar
                    </Button>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <Button
                      color="error"
                      size="small"
                      onClick={() => {
                        setProveedor(proveedor);
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
              ))}
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
      </div>
      {
        <ProveedorDialog
          onClose={() => {
            setProd(false);
          }}
          open={prod}
          onCreate={loadProveedores}
          insumos={insumos}
        />
      }
      {proveedor && (
        <UpdateDialog
          key={`${proveedor.id}update`}
          proveedor={proveedor}
          close={() => {
            setUpdate(false);
          }}
          open={update}
          onCreate={loadProveedores}
          insumos={insumos}
        />
      )}
      {proveedor && (
        <DeleteDialog
          key={`${proveedor.id}delete`}
          proveedor={proveedor}
          close={() => {
            setRemove(false);
          }}
          open={remove}
          onCreate={loadProveedores}
        />
      )}
    </div>
  );
};

export function ProveedorDialog({
  open,
  onClose,
  onCreate,
  insumos,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: () => void;
  insumos: Array<IInsumo>;
}) {
  const [loading, setLoading] = useState(false);
  const [insumo, setInsumo] = useState("");
  const [insumoProveedores, setInsumoProveedores] = useState<
    Array<IInsumoProveedor>
  >([]);
  const [medicion, setMedicion] = useState("no hay");

  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      nombre: "",
      telefono: "",
      email: "",
      cantidad: 0,
      precio: 0,
      insumos: Array<IInsumoProveedor>(),
    },
  });

  const onChangeMedicion = (id: any) => {
    insumos.forEach((insumoFor) => {
      if (insumoFor.id === id) {
        setMedicion(insumoFor.medicion);
      }
    });
  };

  const onAddClick = () => {
    let cantidad = control._formValues.cantidad;
    let precio = control._formValues.precio;

    if (cantidad <= 0 || insumo == "") {
      toast.error("Introduzca todos los datos para agregar un insumo");
    } else {
      let newInsumoProveedores = {
        insumoId: parseInt(insumo),
        cantidad: parseFloat(cantidad),
        precio: parseFloat(precio),
      } as IInsumoProveedor;
      insumoProveedores.push(new InsumoProveedor(newInsumoProveedores));
      setInsumo("");
      setMedicion("no hay");
      setValue("cantidad", 0, { shouldValidate: false, shouldDirty: false });
      setValue("precio", 0, { shouldValidate: false, shouldDirty: false });
    }
  };

  const onSubmit = async (form: any) => {
    try {
      setLoading(true);
      form.insumos = insumoProveedores;
      const promise = ProveedorService.create(form).then(() => {
        reset();
        setInsumo("");
        setInsumoProveedores([]);
        setMedicion("no hay");
        onClose();
      });

      toast.promise(promise, {
        success: "Proveedor registrado con éxito",
        pending: "Espere por favor..",
        error: "Error",
      });
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <AppBar position="static" elevation={1} style={{ padding: 10 }}>
        <Box sx={{ display: "flex" }}>
          <Typography variant="h6">Proveedor</Typography>
          <Box sx={{ flexGrow: 10 }} />
          <IconButton style={{ color: "white" }} onClick={onClose}></IconButton>
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
              Crear Proveedor
            </Typography>
            <div style={{ marginBottom: 15 }}>
              <Typography variant="subtitle2">Nombre</Typography>
              <Controller
                name="nombre"
                control={control}
                render={({ field }) => (
                  <TextField
                    type="text"
                    variant="outlined"
                    {...field}
                    fullWidth
                    placeholder=""
                    required
                  />
                )}
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <Typography variant="subtitle2">Telefono</Typography>
              <Controller
                name="telefono"
                control={control}
                render={({ field }) => (
                  <TextField
                    type="number"
                    variant="outlined"
                    {...field}
                    fullWidth
                    placeholder=""
                    required
                  />
                )}
              />
            </div>
            <div style={{ marginBottom: 15 }}>
              <Typography variant="subtitle2">Email</Typography>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    type="text"
                    variant="outlined"
                    {...field}
                    fullWidth
                    placeholder=""
                    required
                  />
                )}
              />
            </div>
            <div style={{ marginBottom: 10 }}>
              <Typography variant="subtitle2">Insumos</Typography>
              <Typography variant="overline">Insumo</Typography>
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
              <Typography variant="overline">Cantidad</Typography>
              <Controller
                name="cantidad"
                control={control}
                render={({ field }) => (
                  <TextField
                    id="cantidadTextField"
                    type="number"
                    variant="outlined"
                    {...field}
                    style={{ width: "40%", margin: "10px" }}
                    placeholder=""
                  />
                )}
              />
              <Typography variant="overline">{medicion}</Typography>
              <br />
              <Typography variant="overline">Precio</Typography>
              <Controller
                name="precio"
                control={control}
                render={({ field }) => (
                  <TextField
                    type="number"
                    variant="outlined"
                    {...field}
                    style={{ width: "40%", margin: "10px" }}
                    placeholder=""
                  />
                )}
              />
              <Typography variant="overline">MXN</Typography>
            </div>
            {insumoProveedores.map((insumoProveedor, index1) =>
              insumos.map((insumo, index2) =>
                insumo.id == insumoProveedor.insumoId ? (
                  <div
                    id="insumoDiv"
                    key={index1 + "insumoProveedor" + index2}
                    onClick={() => {
                      delete insumoProveedores[index1];
                      let insumosProveedoresNew: Array<IInsumoProveedor> = [];
                      insumoProveedores.forEach((insumoProveedor) => {
                        if (insumo == null) {
                        } else {
                          insumosProveedoresNew.push(insumoProveedor);
                        }
                      });
                      setInsumoProveedores([]);
                      setInsumoProveedores(insumosProveedoresNew);
                    }}
                  >
                    {insumo.nombre +
                      " " +
                      insumoProveedor.cantidad +
                      " " +
                      insumo.medicion +
                      " $" +
                      insumoProveedor.precio +
                      "MXN"}
                  </div>
                ) : null
              )
            )}

            <Typography variant="caption">
              Dé click al insumo para eliminarlo
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
              Agregar insumo
            </Button>
            <Grid container justifyContent="end">
              <Button
                sx={{ my: 2 }}
                onClick={() => {
                  reset();
                  setInsumo("");
                  setInsumoProveedores([]);
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
                Crear
              </Button>
            </Grid>
          </form>
        </Paper>
      </Container>
    </Dialog>
  );
}

function UpdateDialog({
  proveedor,
  open,
  close,
  onCreate,
  insumos,
}: {
  proveedor: IProveedor;
  open: boolean;
  close: () => void;
  onCreate: () => void;
  insumos: Array<IInsumo>;
}) {
  const [loading, setLoading] = useState(false);
  const [insumo, setInsumo] = useState("");
  const [medicion, setMedicion] = useState("no hay");
  const [insumoProveedores, setInsumoProveedores] = useState<
    Array<IInsumoProveedor>
  >([]);

  useEffect(() => {
    loadInsumoProveedores();
  }, []);

  const loadInsumoProveedores = async () => {
    try {
      const resultsInsumoProd = await InsumoProveedorService.getWithId(
        proveedor.id
      );
      setInsumoProveedores(resultsInsumoProd.InsumoProveedores);
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      id: proveedor.id,
      nombre: proveedor.nombre,
      telefono: proveedor.telefono,
      precio: 0,
      cantidad: 0,
      email: proveedor.email,
      insumos: Array<IInsumoProveedor>(),
    },
  });

  const onChangeMedicion = (id: any) => {
    insumos.forEach((insumoFor) => {
      if (insumoFor.id === id) {
        setMedicion(insumoFor.medicion);
      }
    });
  };

  const onAddClick = () => {
    let cantidad = control._formValues.cantidad;
    let precio = control._formValues.precio;

    if (cantidad <= 0 || insumo == "") {
      toast.error("Introduzca todos los datos para agregar un insumo");
    } else {
      let newInsumoProveedores = {
        insumoId: parseInt(insumo),
        cantidad: parseFloat(cantidad),
        precio: parseFloat(precio)
      } as IInsumoProveedor;
      insumoProveedores.push(new InsumoProveedor(newInsumoProveedores));
      setInsumo("");
      setMedicion("no hay");
      setValue("cantidad", 0, { shouldValidate: false, shouldDirty: false });
      setValue("precio", 0, { shouldValidate: false, shouldDirty: false });

    }
  };

  const onSubmit = async (data: any) => {
    try {
      data.insumos = insumoProveedores;
      const promise = ProveedorService.update(data);
      toast.promise(promise, {
        pending: "Espere por favor..",
        success: "Proveedor actualizado",
        error: "Error",
      });
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
      <DialogTitle>Editar Proveedor</DialogTitle>
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ margin: "0px 20px 20px 20px" }}
      >
        <div style={{ marginBottom: 15 }}>
          <Typography variant="subtitle2">Nombre</Typography>
          <Controller
            name="nombre"
            control={control}
            render={({ field }) => (
              <TextField
                type="text"
                variant="outlined"
                {...field}
                fullWidth
                placeholder=""
                required
              />
            )}
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <Typography variant="subtitle2">Telefono</Typography>
          <Controller
            name="telefono"
            control={control}
            render={({ field }) => (
              <TextField
                type="number"
                variant="outlined"
                {...field}
                fullWidth
                placeholder=""
                required
              />
            )}
          />
        </div>
        <div style={{ marginBottom: 15 }}>
          <Typography variant="subtitle2">Email</Typography>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                type="email"
                variant="outlined"
                {...field}
                fullWidth
                placeholder=""
                required
              />
            )}
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <Typography variant="subtitle2">Insumos</Typography>
          <Typography variant="overline">Insumo</Typography>
          <Select
            style={{ width: "30%", margin: "10px" }}
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
          <Typography variant="overline">Cantidad</Typography>
          <Controller
            name="cantidad"
            control={control}
            render={({ field }) => (
              <TextField
                id="cantidadTextField"
                type="number"
                variant="outlined"
                {...field}
                style={{ width: "30%", margin: "10px" }}
                placeholder=""
              />
            )}
          />
          <Typography variant="overline">{medicion}</Typography>
        </div>
        <Typography variant="overline">Precio</Typography>
        <Controller
          name="precio"
          control={control}
          render={({ field }) => (
            <TextField
              type="number"
              variant="outlined"
              {...field}
              style={{ width: "40%", margin: "10px" }}
              placeholder=""
            />
          )}
        />
        <Typography variant="overline">MXN</Typography>
        {insumoProveedores.map((insumoProveedor, index1) =>
          insumos.map((insumo, index2) =>
            insumo.id == insumoProveedor.insumoId ? (
              <div
                id="insumoDiv"
                key={index1 + "insumoProveedor" + index2}
                onClick={() => {
                  delete insumoProveedores[index1];
                  let insumosProveedoresNew: Array<IInsumoProveedor> = [];
                  insumoProveedores.forEach((insumoProveedor) => {
                    if (insumo == null) {
                    } else {
                      insumosProveedoresNew.push(insumoProveedor);
                    }
                  });
                  setInsumoProveedores([]);
                  setInsumoProveedores(insumosProveedoresNew);
                }}
              >
                {insumo.nombre +
                  " " +
                  insumoProveedor.cantidad +
                  " " +
                  insumo.medicion +
                  " " +
                  insumoProveedor.precio +
                  "MXN"}
              </div>
            ) : null
          )
        )}
        <Typography variant="caption">
          Dé click al insumo para eliminarlo
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
          Agregar insumo
        </Button>
        <DialogActions style={{ marginTop: 10 }}>
          <Button
            onClick={() => {
              reset();
              close();
            }}
          >
            Cancelar
          </Button>
          <Button variant="contained" type="submit" disabled={loading}>
            Actualizar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

function DeleteDialog({
  proveedor,
  open,
  close,
  onCreate,
}: {
  proveedor: IProveedor;
  open: boolean;
  close: () => void;
  onCreate: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      if (proveedor.id) await ProveedorService.remove(proveedor.id);
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
          El Proveedor {proveedor.nombre} sera eliminado PERMANENTEMENTE junto
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

export default ProveedorList;
