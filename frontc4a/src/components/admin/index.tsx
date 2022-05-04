import "bootstrap/dist/css/bootstrap.css";
import ReactDOM from "react-dom";
import { User } from "../models/User";
import { useContext, useEffect, useState } from "react";
import { AuthContext, IAuthContext } from "../context/AuthContext";
import { Route, useNavigate } from "react-router-dom";
import UserList from "./userList";
import InsumoList from "./InsumoList";
import ProductoList from "./productoList";
import ProveedorList from "./proveedorList";
import Reportes from "./reportes";
import VentasPanel from "../public/ventas";
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import EggOutlinedIcon from "@mui/icons-material/EggOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import FreeBreakfastOutlinedIcon from "@mui/icons-material/FreeBreakfastOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';

const Index = () => {
  const { logout } = useContext(AuthContext) as IAuthContext;
  const user = localStorage.getItem("currentUser");
  let navigate = useNavigate();

  let jsonUser;
  if (user) {
    jsonUser = JSON.parse(user);
  }

  const Users = () => {
    let mainDiv = document.getElementById("mainDiv");
    if (mainDiv) {
      if (mainDiv.children.length > 0) {
        ReactDOM.unmountComponentAtNode(mainDiv);
      }
      ReactDOM.render(<UserList />, mainDiv);
    }
  };

  const Insumos = () => {
    let mainDiv = document.getElementById("mainDiv");
    if (mainDiv) {
      if (mainDiv.children.length > 0) {
        ReactDOM.unmountComponentAtNode(mainDiv);
      }
      ReactDOM.render(<InsumoList />, mainDiv);
    }
  };

  const Productos = () => {
    let mainDiv = document.getElementById("mainDiv");
    if (mainDiv) {
      if (mainDiv.children.length > 0) {
        ReactDOM.unmountComponentAtNode(mainDiv);
      }
      ReactDOM.render(<ProductoList />, mainDiv);
    }
  };

  const Proveedores = () => {
    let mainDiv = document.getElementById("mainDiv");
    if (mainDiv) {
      if (mainDiv.children.length > 0) {
        ReactDOM.unmountComponentAtNode(mainDiv);
      }
      ReactDOM.render(<ProveedorList />, mainDiv);
    }
  };

  const Ventas = () => {
    let mainDiv = document.getElementById("mainDiv");
    if (mainDiv) {
      if (mainDiv.children.length > 0) {
        ReactDOM.unmountComponentAtNode(mainDiv);
      }
      ReactDOM.render(<VentasPanel />, mainDiv);
    }
  };

  
  const reportes = () => {
    let mainDiv = document.getElementById("mainDiv");
    if (mainDiv) {
      if (mainDiv.children.length > 0) {
        ReactDOM.unmountComponentAtNode(mainDiv);
      }
      ReactDOM.render(<Reportes />, mainDiv);
    }
  };

  useEffect(() => {
    let lastPage = localStorage.getItem("lastPage");

    if (lastPage) {
      if (lastPage == "users") Users();
      if (lastPage == "insumos") Insumos();
      if (lastPage == "productos") Productos();
      if (lastPage == "proveedores") Proveedores();     
      if (lastPage == "reportes") reportes();
    }
  }, []);

  const salir = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <input type="checkbox" id="sidebar-toggle" />
      {/*side bar*/}
      <div className="sidebar">
        {/*sidebar-header*/}
        <div className="sidebar-header">
          <h3 className="brand">
            <span>Coffee4All</span>
          </h3>
          <label htmlFor="sidebar-toggle" style={{ cursor: "pointer" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={16}
              height={16}
              fill="currentColor"
              className="bi bi-list"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
              />
            </svg>
          </label>
        </div>
        {/*sidebar-menu*/}
        <div className="sidebar-menu">
          <List>
            <ListItem button style={{ paddingLeft: 3 }} onClick={Users}>
              <ListItemIcon onClick={Users}>
                <PersonOutlineOutlinedIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={"Usuarios"} />
            </ListItem>
            <ListItem button style={{ paddingLeft: 3 }} onClick={Insumos}>
              <ListItemIcon>
                <EggOutlinedIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={"Insumos"}  />
            </ListItem>
            <ListItem button style={{ paddingLeft: 3 }}onClick={Productos}>
              <ListItemIcon >
                <FreeBreakfastOutlinedIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={"Productos"} />
            </ListItem>
            <ListItem button style={{ paddingLeft: 3 }} onClick={Proveedores}>
              <ListItemIcon >
                <LocalShippingOutlinedIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={"Proveedores"} />
            </ListItem>
            <ListItem button style={{ paddingLeft: 3 }} onClick={(e)=>{navigate("/ventas");}}>
              <ListItemIcon >
                <AttachMoneyOutlinedIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={"Ventas"}/>
            </ListItem>
            <ListItem button style={{ paddingLeft: 3 }} onClick={reportes}>
              <ListItemIcon >
                <AssessmentOutlinedIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={"Reportes"}/>
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button style={{ paddingLeft: 3 }} onClick={salir}>
              <ListItemIcon>              
                <ExitToAppOutlinedIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary={"Salir"}  />
            </ListItem>
          </List>        
        </div>
      </div>
      {/*main-content*/}
      <div className="main-content">
        {/*header*/}
        <header>
          <span>
            {jsonUser ? "Bienvenid@: " + jsonUser.nombre : "Detext Text"}
          </span>
        </header>
        {/*main*/}
        <main>
          {/*cards*/}
          <section className="recent" id="mainDiv"></section>
        </main>
      </div>
    </>
  );
};

export default Index;
