import React, { Component } from 'react'
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import '../node_modules/font-awesome/css/font-awesome.css'


export default class Types extends Component {

  render() {
      return(

              <select class="custom-select" size="3" id="sel1">
                <option selected value="accounting,airport,amusement_park,aquarium,art_gallery,atm,bakery,bank,bar,beauty_salon">Todos</option>
                <option value="accounting">Contabilidad</option>
                <option value="airport">Aeropuerto</option>
                <option value="amusement_park">Parque de atracciones</option>
                <option value="aquarium">Acuario</option>
                <option value="art_gallery">Galería de arte</option>
                <option value="atm">Cajero automático</option>
                <option value="bakery">Panadería</option>
                <option value="bank">Banco</option>
                <option value="bar">Bar</option>
                <option value="beauty_salon">Salón de belleza</option>
                <option value="bicycle_store">Tienda de bicicletas</option>
                <option value="book_store">Librería</option>
                <option value="bowling_alley">Bolera</option>
                <option value="bus_station">Estación de autobuses</option>
                <option value="cafe">Cafetería</option>
                <option value="campground">Camping</option>
                <option value="car_dealer">Concesionario de coches</option>
                <option value="car_rental">Alquiler de coches</option>
                <option value="car_repair">Taller Mecanico</option>
                <option value="car_wash">Lavadero de coches</option>
                <option value="casino">Cacino</option>
                <option value="cemetery">Cementerio</option>
                <option value="church">Iglesia</option>
                <option value="city_hall">Palacio de Gobierno</option>
                <option value="clothing_store">Tienda de Ropa</option>
              </select>
  
      )
      }
    }

