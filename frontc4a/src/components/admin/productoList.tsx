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
import { IProducto, Producto } from "../models/Producto";
import { IInsumoProducto, InsumoProducto } from "../models/InsumoProducto";
import ProductoService from "../services/ProductoService";
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
import InsumoProductoService from "../services/InsumoProducto.Service";
import { IInsumo } from "../models/Insumo";
import InsumoService from "../services/Insumos.Service";
import DropZone from "./DropZone";
import ImagenesService from "../services/Imagenes.Service";

const ProductoList = () => {
  const [productos, setProductos] = useState<Array<Producto>>([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [producto, setProducto] = useState<Producto | undefined>();
  const [insumosProductos, setInsumosProductos] = useState<
    Array<IInsumoProducto>
  >([]);
  const [insumos, setInsumos] = useState<Array<IInsumo>>([]);
  const [remove, setRemove] = useState(false);
  const [update, setUpdate] = useState(false);
  const [prod, setProd] = useState(false);
  const [imagenes, setImagenes] = useState<Array<string>>([]);

  require("./css/productoList.css");

  useEffect(() => {
    loadProductos();
    localStorage.setItem("lastPage", "productos");
  }, [prod, total, limit, page, update, remove]);

  const loadProductos = async () => {
    try {
      const resultsProd = await ProductoService.list(limit, page * limit);
      const resultsInsumoProd = await InsumoProductoService.getAll();
      const resultsInsumo = await InsumoService.getAll();

      for (let i = 0; i < resultsProd.productos.length; i++) {
        const imagen = await ImagenesService.get(resultsProd.productos[i].foto);

        imagenes.push(imagen.result);
      }

      setInsumosProductos(resultsInsumoProd.insumoProductos);
      setProductos(resultsProd.productos);
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
            <h2 className="myaccount-content">Productos registrados</h2>
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
              Crear Producto
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
                <TableCell>Precio</TableCell>
                <TableCell>Foto</TableCell>
                <TableCell>Insumos</TableCell>
                <TableCell>Editar</TableCell>
                <TableCell>Eliminar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productos.map((producto, index) => {
                let imagen = "";
                for (let i = 0; i < imagenes.length; i++) {
                  let primerParte = imagenes[i].split("/");
                  let segundaParte = primerParte[3].split("?");
                  let key = segundaParte[0];
                  if (key == producto.foto) {
                    imagen = imagenes[i];
                  }
                }

                return (
                  <TableRow
                    key={`${producto.id}${index}user`}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {producto.nombre}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {producto.precio}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {producto.foto ? (
                        <div style={{ textAlign: "center" }}>
                          <img
                            src={imagen}
                            style={{
                              height: "70px",
                              width: "30%",
                              objectFit: "contain",
                            }}
                          />
                        </div>
                      ) : null}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {insumosProductos.map((insumoProducto, index) =>
                        insumos.map((insumo, index) => (
                          <p key={index + "insumo"}>
                            {insumoProducto.productoId == producto.id &&
                            insumoProducto.insumoId == insumo.id
                              ? insumo.nombre +
                                " " +
                                insumoProducto.cantidad +
                                " " +
                                insumo.medicion
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
                          setProducto(producto);
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
                          setProducto(producto);
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
      </div>
      {
        <ProductoDialog
          onClose={() => {
            setProd(false);
          }}
          open={prod}
          onCreate={loadProductos}
          insumos={insumos}
        />
      }
      {producto && (
        <UpdateDialog
          key={`${producto.id}update`}
          producto={producto}
          close={() => {
            setUpdate(false);
          }}
          open={update}
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
    </div>
  );
};

export function ProductoDialog({
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
  const [insumoProductos, setInsumoProductos] = useState<
    Array<IInsumoProducto>
  >([]);
  const [medicion, setMedicion] = useState("no hay");
  const [file, setFile] = useState<File | undefined>();

  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      nombre: "",
      precio: "",
      foto: "",
      cantidad: 0,
      insumos: Array<IInsumoProducto>(),
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

    if (cantidad <= 0 || insumo == "") {
      toast.error("Introduzca todos los datos para agregar un insumo");
    } else {
      let newInsumoProductos = {
        insumoId: parseInt(insumo),
        cantidad: parseFloat(cantidad),
      } as IInsumoProducto;
      insumoProductos.push(new InsumoProducto(newInsumoProductos));
      setInsumo("");
      setMedicion("no hay");
      setValue("cantidad", 0, { shouldValidate: false, shouldDirty: false });
    }
  };

  const onSubmit = async (form: any) => {
    try {
      setLoading(true);
      if (file) {
        const promise1 = ImagenesService.upload(file)
          .then((response) => {
            form.insumos = insumoProductos;
            form.foto = response.result.data;
            toast.promise(promise1, {
              success: "Imagen almanacenada con éxito",
              pending: "Espere por favor, almacenando imagen",
              error: "Error",
            });
            const promise2 = ProductoService.create(form).then((response) => {
              reset();
              setInsumo("");
              setInsumoProductos([]);
              setMedicion("no hay");
              onClose();
            });

            toast.promise(promise2, {
              success: "Producto registrado con éxito",
              pending: "Espere por favor..",
              error: "Error",
            });
          })
          .catch((err) => {
            toast.error(err.mesagge);
          });
      } else {
        toast.error("Seleccione una imagen");
      }
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
          <Typography variant="h6">Producto</Typography>
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
              Crear Producto
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
              <Typography variant="subtitle2">Precio</Typography>
              <Controller
                name="precio"
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
            </div>

            {insumoProductos.map((insumoProducto, index1) =>
              insumos.map((insumo, index2) =>
                insumo.id == insumoProducto.insumoId ? (
                  <div
                    id="insumoDiv"
                    key={index1 + "insumoProducto" + index2}
                    onClick={() => {
                      delete insumoProductos[index1];
                      let insumosProductosNew: Array<IInsumoProducto> = [];
                      insumoProductos.forEach((insumoProducto) => {
                        if (insumo == null) {
                        } else {
                          insumosProductosNew.push(insumoProducto);
                        }
                      });
                      setInsumoProductos([]);
                      setInsumoProductos(insumosProductosNew);
                    }}
                  >
                    {insumo.nombre +
                      " " +
                      insumoProducto.cantidad +
                      " " +
                      insumo.medicion}
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
            <div style={{ marginBottom: 15 }}>
              <Typography variant="subtitle2">Foto</Typography>
              {file ? (
                <>
                  <div style={{ textAlign: "center" }}>
                    <img
                      src={URL.createObjectURL(file)}
                      style={{
                        height: 300,
                        width: 300,
                        objectFit: "contain",
                      }}
                    />
                  </div>
                  <Typography variant="body1" component="span">
                    {file.name}
                  </Typography>
                </>
              ) : null}
              <DropZone
                saveFile={async (file) => {
                  setFile(file);
                }}
              />
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
  producto,
  open,
  close,
  onCreate,
  insumos,
}: {
  producto: IProducto;
  open: boolean;
  close: () => void;
  onCreate: () => void;
  insumos: Array<IInsumo>;
}) {
  const [loading, setLoading] = useState(false);
  const [insumo, setInsumo] = useState("");
  const [medicion, setMedicion] = useState("no hay");
  const [insumoProductos, setInsumoProductos] = useState<
    Array<IInsumoProducto>
  >([]);
  const [file, setFile] = useState<File | undefined>();
  const [imagen, setImagen] = useState<string>("");

  useEffect(() => {
    loadInsumoProductos();
    ImagenesService.get(producto.foto).then((response) =>
      setImagen(response.result)
    );
  }, []);

  const loadInsumoProductos = async () => {
    try {
      const resultsInsumoProd = await InsumoProductoService.getWithId(
        producto.id
      );
      setInsumoProductos(resultsInsumoProd.insumoProductos);
    } catch (e) {
      console.log(e);
    } finally {
    }
  };

  const { control, handleSubmit, reset, setValue } = useForm({
    defaultValues: {
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 0,
      foto: producto.foto,
      insumos: Array<IInsumoProducto>(),
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

    if (cantidad <= 0 || insumo == "") {
      toast.error("Introduzca todos los datos para agregar un insumo");
    } else {
      let newInsumoProductos = {
        insumoId: parseInt(insumo),
        cantidad: parseFloat(cantidad),
      } as IInsumoProducto;
      insumoProductos.push(new InsumoProducto(newInsumoProductos));
      setInsumo("");
      setMedicion("no hay");
      setValue("cantidad", 0, { shouldValidate: false, shouldDirty: false });
    }
  };

  const onSubmit = async (data: any) => {
    try {
      if (file) {
        data.insumos = insumoProductos;
        const promise1 = await ImagenesService.delete(producto.foto)
          .then(() => {
            const promise2 = ImagenesService.upload(file)
              .then((response2) => {
                data.foto = response2.result.data;
                console.log(data);
                const promise3 = ProductoService.update(data)
                  .then((response2) => {
                    toast.promise(promise3, {
                      success: "Producto actualizado",
                      pending: "Espere por favor..",
                      error: "Error",
                    });
                    setFile(undefined);
                    close();
                  })
                  .catch((error) => {
                    toast.error(error.message);
                  });
              })
              .catch((error) => {
                toast.error(error.message);
              });
            toast.promise(promise2, {
              success: "Imagen almacenada con éxito",
              pending: "Espere por favor, subiendo imagen",
              error: "Error",
            });
          })
          .catch((error) => {
            toast.error(error);
          });
      } else {
        data.insumos = insumoProductos;
        const promise = ProductoService.update(data);
        toast.promise(promise, {
          pending: "Espere por favor..",
          success: "Insumo actualizado",
          error: "Error",
        });
        setFile(undefined);
        close();
        onCreate();
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={close} fullWidth>
      <DialogTitle>Editar Producto</DialogTitle>
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
          <Typography variant="subtitle2">Precio</Typography>
          <Controller
            name="precio"
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

        {insumoProductos.map((insumoProducto, index1) =>
          insumos.map((insumo, index2) =>
            insumo.id == insumoProducto.insumoId ? (
              <div
                id="insumoDiv"
                key={index1 + "insumoProducto" + index2}
                onClick={() => {
                  delete insumoProductos[index1];
                  let insumosProductosNew: Array<IInsumoProducto> = [];
                  insumoProductos.forEach((insumoProducto) => {
                    if (insumo == null) {
                    } else {
                      insumosProductosNew.push(insumoProducto);
                    }
                  });
                  setInsumoProductos([]);
                  setInsumoProductos(insumosProductosNew);
                }}
              >
                {insumo.nombre +
                  " " +
                  insumoProducto.cantidad +
                  " " +
                  insumo.medicion}
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
        <div style={{ marginBottom: 15 }}>
          <Typography variant="subtitle2">Foto</Typography>
          {file ? (
            <>
              <div style={{ textAlign: "center" }}>
                <img
                  src={URL.createObjectURL(file)}
                  style={{
                    height: 300,
                    width: 300,
                    objectFit: "contain",
                  }}
                />
              </div>
              <Typography variant="body1" component="span">
                {file.name}
              </Typography>
            </>
          ) : null}
          {producto.foto ? (
            <div style={{ textAlign: "center" }}>
              <img
                src={imagen}
                style={{
                  height: 300,
                  width: 300,
                  objectFit: "contain",
                }}
              />
            </div>
          ) : null}
          <DropZone
            saveFile={async (file) => {
              setFile(file);
            }}
          />
        </div>
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
      if (producto.id) await ProductoService.remove(producto.id);
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
          El Producto {producto.nombre} sera eliminado PERMANENTEMENTE junto con
          sus datos
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

export default ProductoList;
