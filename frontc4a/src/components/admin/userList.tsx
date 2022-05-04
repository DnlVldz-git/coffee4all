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
import { IUser, User } from "../models/User";
import UserService from "../services/User.Service";
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

const UserList = () => {
  const [users, setUsers] = useState<Array<User>>([]);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);
  const [user, setUser] = useState<User | undefined>();
  const [remove, setRemove] = useState(false);
  const [update, setUpdate] = useState(false);
  const [person, setPerson] = useState(false);
  

  useEffect(() => {
    loadUsers();    
    localStorage.setItem("lastPage", "users");
  }, [person, total, page, limit]);

  const loadUsers = async () => {
    try {
      const results = await UserService.list(limit, page* limit);
      setUsers(results.users);
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
            <h2 className="myaccount-content">Usuarios registrados</h2>
          </div>
          <div className="col-3-2">
            <Button
              color="primary"
              size="small"
              onClick={() => {
                setPerson(true);
              }}
              style={{
                float: "right",
                marginRight: "10px",
                marginBottom: "10px",
              }}
              variant="outlined"
            >
              Crear Usuario
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
                <TableCell>Email</TableCell>
                <TableCell>Rol</TableCell>
                <TableCell>Editar</TableCell>
                <TableCell>Eliminar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, index) => (
                <TableRow
                  key={`${user.id}${index}user`}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {user.nombre}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {user.email}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {user.rol}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <Button
                      color="secondary"
                      size="small"
                      onClick={() => {
                        setUser(user);
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
                        setUser(user);
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
        <PersonDialog
          onClose={() => {
            setPerson(false);
          }}
          open={person}
          onCreate={loadUsers}
        />
      }
      {user && (
        <UpdateDialog
          key={`${user.id}update`}
          user={user}
          close={() => {
            setUpdate(false);
          }}
          open={update}
          onCreate={loadUsers}
        />
      )}
      {user && (
        <DeleteDialog
          key={`${user.id}delete`}
          user={user}
          close={() => {
            setRemove(false);
          }}
          open={remove}
          onCreate={loadUsers}
        />
      )}
    </div>
  );
};

export function PersonDialog({
  open,
  onClose,
  onCreate,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [rol, setRol] = useState("");

  var CryptoJS = require("crypto-js");

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      nombre: "",
      apellido_pat: "",
      apellido_mat: "",
      email: "",
      telefono: "",
      foto: "",
      pwd: "",
      rol: "",
    },
  });

  const onSubmit = async (form: any) => {
    try {
      setLoading(true);
      form.rol = rol;
      var encryptedAES = CryptoJS.AES.encrypt(form.pwd, "cfa");
      form.pwd = encryptedAES.toString();
      const promise = UserService.register(form).then((response) => {
        if (response === "usuario existente") {
          toast.error("Usuario con ese email ya existe", {
            position: "top-right",
          });
        } else {
          reset();
          onClose();
          toast.success("Usuario registrado con éxito", {
            position: "top-right",
          });
        }
      });
      toast.promise(promise, {
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
    <Dialog open={open} onClose={onClose} fullWidth>
      <AppBar position="static" elevation={1} style={{ padding: 10 }}>
        <Box sx={{ display: "flex" }}>
          <Typography variant="h6">Usuario</Typography>
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
              Crear usuario
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
            <div style={{ marginBottom: 15 }}>
              <Typography variant="subtitle2">Apellido Paterno</Typography>
              <Controller
                name="apellido_pat"
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
            <div style={{ marginBottom: 15 }}>
              <Typography variant="subtitle2">Apellido Materno</Typography>
              <Controller
                name="apellido_mat"
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
            <div style={{ marginBottom: 15 }}>
              <Typography variant="subtitle2">E-mail</Typography>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
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
                  />
                )}
              />
            </div>
            <div style={{ marginBottom: 15 }}>
              <Typography variant="subtitle2">Foto</Typography>
              <Controller
                name="foto"
                control={control}
                render={({ field }) => (
                  <TextField
                    type="text"
                    variant="outlined"
                    {...field}
                    fullWidth
                    placeholder=""
                  />
                )}
              />
            </div>
            <div style={{ marginBottom: 15 }}>
              <Typography variant="subtitle2">Password</Typography>
              <Controller
                name="pwd"
                control={control}
                render={({ field }) => (
                  <TextField
                    type="password"
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
              <Typography variant="subtitle2">Rol</Typography>
              <Select
                required
                fullWidth
                value={rol}
                onChange={(e) => {
                  setRol(e.target.value);
                }}
              >
                <MenuItem value={"User"}>User</MenuItem>
                <MenuItem value={"Admin"}>Admin</MenuItem>
              </Select>
            </div>
            <Grid container justifyContent="end">
              <Button
                sx={{ my: 2 }}
                onClick={() => {
                  reset();
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
  user,
  open,
  close,
  onCreate,
}: {
  user: IUser;
  open: boolean;
  close: () => void;
  onCreate: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      nombre: user.nombre,
      apellido_pat: user.apellido_pat,
      apellido_mat: user.apellido_mat,
      email: user.email,
      telefono: user.telefono,
      foto: user.foto,
      rol: user.rol,
      pwd: undefined,
    },
  });

  const [rol, setRol] = useState(user.rol);
  var CryptoJS = require("crypto-js");

  const onSubmit = async (data: any) => {
    try {
      if (data.pwd && data.pwd.trim()) {
        var encryptedAES = CryptoJS.AES.encrypt(data.pwd, "cfa");
        data = {
          ...data,
          pwd: encryptedAES.toString(),
        };
      } else {
        data = {
          ...data,
          pwd: user.pwd,
        };
      }
      data.id = user.id;
      const promise = UserService.update(data);
      toast.promise(promise, {
        pending: "Espere por favor..",
        success: "Usuario actualizado",
        error: "Error",
      });
      reset({
        nombre: "",
        apellido_pat: "",
        apellido_mat: "",
        telefono: "",
        foto: "",
        email: "",
        pwd: undefined,
        rol: "",
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
      <DialogTitle>Editar Usuario</DialogTitle>
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
        <div style={{ marginBottom: 15 }}>
          <Typography variant="subtitle2">Apellido Paterno</Typography>
          <Controller
            name="apellido_pat"
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
        <div style={{ marginBottom: 15 }}>
          <Typography variant="subtitle2">Apellido Materno</Typography>
          <Controller
            name="apellido_mat"
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
        <div style={{ marginBottom: 15 }}>
          <Typography variant="subtitle2">E-mail</Typography>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
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
              />
            )}
          />
        </div>
        <div style={{ marginBottom: 15 }}>
          <Typography variant="subtitle2">Foto</Typography>
          <Controller
            name="foto"
            control={control}
            render={({ field }) => (
              <TextField
                type="text"
                variant="outlined"
                {...field}
                fullWidth
                placeholder=""
              />
            )}
          />
        </div>
        <div style={{ marginBottom: 15 }}>
          <Typography variant="subtitle2">Password</Typography>
          <Controller
            name="pwd"
            control={control}
            render={({ field }) => (
              <TextField
                type="password"
                variant="outlined"
                {...field}
                fullWidth
                placeholder=""
              />
            )}
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <Typography variant="subtitle2">Rol</Typography>
          <Select
            required
            fullWidth
            value={rol}
            onChange={(e) => {
              setRol(e.target.value);
            }}
          >
            <MenuItem value={"User"}>User</MenuItem>
            <MenuItem value={"Admin"}>Admin</MenuItem>
          </Select>
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
  user,
  open,
  close,
  onCreate,
}: {
  user: IUser;
  open: boolean;
  close: () => void;
  onCreate: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      if (user.id) await UserService.remove(user.id);
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
          El usuario {user.email} sera eliminado PERMANENTEMENTE junto con sus
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

export default UserList;
