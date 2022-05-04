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
import { IInsumo, Insumo } from "../models/Insumo";
import InsumoService from "../services/Insumos.Service";
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
  Container,
  MenuItem,
  Select,
} from "@mui/material";
import { toast } from "react-toastify";
import DropZone from "./DropZone";
import ImagenesService from "../services/Imagenes.Service";

const InsumoList = () => {
  const [insumos, setInsumos] = useState<Array<Insumo>>([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [insumo, setInsumo] = useState<Insumo | undefined>();
  const [remove, setRemove] = useState(false);
  const [update, setUpdate] = useState(false);
  const [ins, setIns] = useState(false);
  const [imagenes, setImagenes] = useState<Array<string>>([]);

  useEffect(() => {
    loadInsumos();
    localStorage.setItem("lastPage", "insumos");
  }, [ins, page, limit]);

  const loadInsumos = async () => {
    try {
      const results = await InsumoService.list(limit, page * limit);

      for (let i = 0; i < results.insumos.length; i++) {
        const imagen = await ImagenesService.get(results.insumos[i].foto);

        imagenes.push(imagen.result);
      }

      setInsumos(results.insumos);
      setTotal(results.total);
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
            <h2 className="myaccount-content">Insumos registrados</h2>
          </div>
          <div className="col-3-2">
            <Button
              color="primary"
              size="small"
              onClick={() => {
                setIns(true);
              }}
              style={{
                float: "right",
                marginRight: "10px",
                marginBottom: "10px",
              }}
              variant="outlined"
            >
              Crear Insumo
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
                <TableCell>Medicion</TableCell>
                <TableCell>Foto</TableCell>
                <TableCell>Editar</TableCell>
                <TableCell>Eliminar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {insumos.map((insumo, index) => {

                let imagen = "";
                for(let i = 0; i < imagenes.length; i++){
                  let primerParte = imagenes[i].split("/");
                  let segundaParte = primerParte[3].split("?");
                  let key = segundaParte[0];
                  if(key == insumo.foto){
                    imagen = imagenes[i];
                  }
                }
                
                return (
                  <TableRow
                    key={`${insumo.id}${index}user`}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {insumo.nombre}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {insumo.medicion}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {insumo.foto ? (
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
                      <Button
                        color="secondary"
                        size="small"
                        onClick={() => {
                          setInsumo(insumo);
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
                          setInsumo(insumo);
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
        <InsumoDialog
          onClose={() => {
            setIns(false);
          }}
          open={ins}
          onCreate={loadInsumos}
        />
      }
      {insumo && (
        <UpdateDialog
          key={`${insumo.id}update`}
          insumo={insumo}
          close={() => {
            setUpdate(false);
          }}
          open={update}
          onCreate={loadInsumos}
        />
      )}
      {insumo && (
        <DeleteDialog
          key={`${insumo.id}delete`}
          insumo={insumo}
          close={() => {
            setRemove(false);
          }}
          open={remove}
          onCreate={loadInsumos}
        />
      )}
    </div>
  );
};

export function InsumoDialog({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [medicion, setMedicion] = useState("");

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      nombre: "",
      medicion: "",
      foto: "",
    },
  });
  const [file, setFile] = useState<File | undefined>(undefined);

  const onSubmit = async (form: any) => {
    try {
      setLoading(true);
      if (file) {
        form.medicion = medicion;

        const promise1 = ImagenesService.upload(file)
          .then((response1) => {
            form.foto = response1.result.data;
            const promise2 = InsumoService.create(form).then((response2) => {
              toast.promise(promise2, {
                success: "Insumo registrado con éxito",
                pending: "Espere por favor..",
                error: "Error",
              });
              setFile(undefined);
              reset();
              onClose();
            });
          })
          .catch((error) => {
            toast.error(error);
          });
        toast.promise(promise1, {
          success: "Imagen almacenada con éxito",
          pending: "Espere por favor, subiendo imagen",
          error: "Error",
        });
      } else {
        toast.error("Ponga una imagen");
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        onClose();
        setFile(undefined);
      }}
      fullWidth
    >
      <AppBar position="static" elevation={1} style={{ padding: 10 }}>
        <Box sx={{ display: "flex" }}>
          <Typography variant="h6">Insumo</Typography>
          <Box sx={{ flexGrow: 10 }} />
          <IconButton style={{ color: "white" }} onClick={onClose}></IconButton>
        </Box>
      </AppBar>
      <Container maxWidth="md" style={{ marginBottom: 15 }}>
        <Paper variant="outlined" style={{ padding: 20, marginTop: 20 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Typography
              variant="h4"
              style={{ marginTop: 20, marginBottom: 20 }}
              textAlign="center"
            >
              Crear Insumo
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
              <Typography variant="subtitle2">Medicion</Typography>
              <Select
                required
                fullWidth
                name="medicion"
                value={medicion}
                onChange={(e) => {
                  setMedicion(e.target.value);
                }}
              >
                <MenuItem value={"kg"}>Kilogramos</MenuItem>
                <MenuItem value={"gr"}>Gramos</MenuItem>
                <MenuItem value={"lt"}>Litros</MenuItem>
                <MenuItem value={"ml"}>Mililitros</MenuItem>
              </Select>
            </div>
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
                  onClose();
                  setFile(undefined);
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
  insumo,
  open,
  close,
  onCreate,
}: {
  insumo: IInsumo;
  open: boolean;
  close: () => void;
  onCreate: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      nombre: insumo.nombre,
      medicion: insumo.medicion,
      foto: insumo.foto,
    },
  });

  const [file, setFile] = useState<File | undefined>(undefined);
  const [imagen, setImagen] = useState<string>("");
  const [medicion, setMedicion] = useState(insumo.medicion);

  useEffect(() => {
    ImagenesService.get(insumo.foto).then((response) =>
      setImagen(response.result)
    );
  });

  const onSubmit = async (data: any) => {
    try {
      if (file) {
        const promise1 = await ImagenesService.delete(insumo.foto)
          .then(() => {
            const promise2 = ImagenesService.upload(file)
              .then((response2) => {
                data.foto = response2.result.data;
                console.log(data);
                data.id = insumo.id;
                const promise3 = InsumoService.update(data)
                  .then((response2) => {
                    toast.promise(promise3, {
                      success: "Insumo actualizado",
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
        data.id = insumo.id;
        const promise = InsumoService.update(data);
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
    <Dialog
      open={open}
      onClose={() => {
        close();
        setFile(undefined);
      }}
      fullWidth
    >
      <DialogTitle>Editar Insumo</DialogTitle>
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
          <Typography variant="subtitle2">Medicion</Typography>
          <Select
            required
            fullWidth
            value={medicion}
            onChange={(e) => {
              setMedicion(e.target.value);
            }}
          >
            <MenuItem value={"kg"}>Kilogramos</MenuItem>
            <MenuItem value={"gr"}>Gramos</MenuItem>
            <MenuItem value={"lt"}>Litros</MenuItem>
            <MenuItem value={"ml"}>Mililitros</MenuItem>
          </Select>
        </div>
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
          {insumo.foto ? (
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
              setFile(undefined);
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
  insumo,
  open,
  close,
  onCreate,
}: {
  insumo: IInsumo;
  open: boolean;
  close: () => void;
  onCreate: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      if (insumo.id) await InsumoService.remove(insumo.id);
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
          El insumo {insumo.nombre} sera eliminado PERMANENTEMENTE junto con sus
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

export default InsumoList;
