import React, { Component } from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import '../node_modules/font-awesome/css/font-awesome.css'
import './App.css';
import Place from './Place';
import Rating from './Rating';
import Horario from './Horario';
import Modal from './Modal';
import Types from './Types';
//import FB_Login from './FB_Login';

class App extends Component {
  constructor(props){
    super(props);
    this.state={photo:'',
    lat:"",
    lng:"",
    latlng:[],
    marker:null,
    isModalOpen: false,
    isInnerModalOpen: false,
    cercanos:[],
    cambio:false,
    name:[],
    resultados:false,
    directionsService:"",
    directionsRenderer:"",
    reverseGeocode:"",
      
    }
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this); 
    this.getLocation =this.getLocation.bind(this);
    this.getCoordinates = this.getCoordinates.bind(this);
    this.toggleBounce= this.toggleBounce.bind(this);
    this.manejoOnClick=this.manejoOnClick.bind(this);
    this.obtenerLugares=this.obtenerLugares.bind(this);
    this.calculateAndDisplayRoute=this.calculateAndDisplayRoute.bind(this);
    this.directions=this.directions.bind(this);
    this.geocodeLatLng=this.geocodeLatLng.bind(this);   
  }
 
  //loginStatus = (login) =>{
   // this.setState({logged:login})
  //}
    
  componentDidMount(){
    const googlePlaceAPILoad = setInterval(() => {
      if (window.google){
        this.google=window.google;
        clearInterval(googlePlaceAPILoad);
        console.log('Load Place API');
       
        
        const mapCenter = new this.google.maps.LatLng(this.state.lat,this.state.lng);
        this.map = new this.google.maps.Map(document.getElementById('map'), {
          center: mapCenter,
          zoom: 15
          
        });

        this.showMap(mapCenter);
      };
    },100);
  }

 //APERTURA Y CIERRE VENTANA MODAL
 closeModal() {
		this.setState({
			isModalOpen: false
    });
    document.body.className='normalPage'
    document.getElementById('boton').className='mb-3 btn btn-primary'
	}
	openModal() {
		this.setState({
			isModalOpen: true
    });
    document.body.className='overlay'
    document.getElementById('boton').className='mb-3 btn btn-secondary disabled'
     }

 	//POSOCION INICIAL DE ACUERDO AL NAVEGADOR
  getLocation() {
     
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.getCoordinates);
    } 
  }
    getCoordinates(position) {
      this.setState({
        lat:position.coords.latitude,
        lng:position.coords.longitude,
        latlng:[this.state.lat,this.state.lng],  
     })
  
        this.setState({lat:this.state.lat});
        this.setState({lng:this.state.lng});
        var lat = position.coords.latitude;
        var lng = position.coords.longitude;
        document.getElementById("lat").value = lat;
        document.getElementById("lng").value = lng;
        this.geocodeLatLng();
        } 

        //REVERSE GEOCODE PARA OBTENER DIRECCION EN STRING
        geocodeLatLng() {
          var origenLat = document.getElementById("lat").value; //LATITUD
          var origenLng = document.getElementById("lng").value; //LONGITUD
          var origenLatitud = parseFloat(origenLat);  //PASADO A NUMEROS
          var origenLongitud = parseFloat(origenLng); //PASADO A NUMEROS
    
          fetch( `https://maps.googleapis.com/maps/api/geocode/json?latlng=${origenLatitud},${origenLongitud}&key=AIzaSyDnUW5zZvdg6NSAv_h40saS0ETKWawZldk`)
            
          .then((response) => {
                  return  response.json();
                })
                .then((datos) => {
                    this.setState({direccion:datos.results});
                    var direccion = datos.results
                    for (var j = 0; j < direccion.length; j++) {
                  
                    var geocode=direccion[j].formatted_address
            
                  }  
                  var reverseGeocode=direccion[0].formatted_address
                  this.setState({reverseGeocode:this.state.reverseGeocode})
    
                  document.getElementById('reverseGeocode').value = reverseGeocode;     
        
          })      
        }

    //MAPA CENTRAL Y MARCADOR
    showMap(mapCenter) {
      //Se crea una nueva instancia del objeto mapa
     var map = new this.google.maps.Map(document.getElementById('map'),
      {
        zoom: 13,
        center:mapCenter,

      });

    //Creamos el marcador en el mapa con sus propiedades
    //para nuestro obetivo tenemos que poner el atributo draggable en true
    //position pondremos las mismas coordenas que obtuvimos en la geolocalizaciรณn
    var marker = new window.google.maps.Marker({
        map: map,
      
        draggable: true,
        animation: this.google.maps.Animation.DROP,
        position: mapCenter,

      });
  
      //agregamos un evento al marcador junto con la funcion callback al igual que el evento dragend que indica 
      //cuando el usuario a soltado el marcador
     marker.addListener('click', this.toggleBounce=()=>{
      if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
      } else {
        marker.setAnimation(this.google.maps.Animation.BOUNCE);
      }
      })
      
    marker.addListener( 'dragend', function (event)
    {
     //escribimos las coordenadas de la posicion actual del marcador dentro del input #coords
    document.getElementById("lat").value = this.getPosition().lat();
    document.getElementById("lng").value = this.getPosition().lng();
    
    });
    
    marker.addListener('dragend', this.geocodeLatLng,false)
  }

    //FUNCIONALIDADES DE RUTA
    directions(){
     var map = new this.google.maps.Map(document.getElementById('map'), {    
        });
      var directionsService = new this.google.maps.DirectionsService();
      
     var directionsRenderer = new this.google.maps.DirectionsRenderer({
       draggable: true,
       map:map 
     });
      
      directionsRenderer.setMap(map)
      directionsRenderer.setPanel(document.getElementById('right-panel'));

        var control = document.getElementById('floating-panel');
        control.style.display = 'none';
    
     this.calculateAndDisplayRoute(directionsService, directionsRenderer);     
    
    }
    
    calculateAndDisplayRoute(directionsService, directionsRenderer) {
      if(document.getElementsByClassName("btnDireccion")!== null){
      var origenLat = document.getElementById("lat").value; //LATITUD
      var origenLng = document.getElementById("lng").value; //LONGITUD
      var origenLatitud = parseFloat(origenLat);  //PASADO A NUMEROS
      var origenLongitud = parseFloat(origenLng); //PASADO A NUMEROS
      var destinoLat = document.getElementById("destLat").value; //LATITUD
      var destinoLng = document.getElementById("destLng").value; //LONGITUD
      var destinoLatitud = parseFloat(destinoLat);  //PASADO A NUMEROS
      var destinoLongitud = parseFloat(destinoLng); //PASADO A NUMEROS
      var selectedMode = document.getElementById('mode').value;
      
      var request = {origin: {lat: origenLatitud, lng: origenLongitud},
                    destination: {lat: destinoLatitud, lng: destinoLongitud,}, 
                    travelMode:this.google.maps.TravelMode[selectedMode],}
       directionsService.route(request, function(result, status) {
    if (status === 'OK') {
      directionsRenderer.setDirections(result);
     console.log(result)
          } 
        });
        } 
      }

 
  //callback al hacer clic en el marcador lo que hace es quitar y poner la animacion BOUNCE
   toggleBounce() {
  if (this.marker.getAnimation() !== null) {
    this.marker.setAnimation(null);
  } else {
    this.marker.setAnimation(this.google.maps.Animation.BOUNCE);
  }
}

  //LLAMADAS A PLAVE PARA BUSCAR LUGARES
    manejoOnClick = (e) => {
   
    const request = {
      query: document.getElementById('origen').value ,
      fields: ['photos', 'formatted_address', 'name','place_id'],
    };
    this.service = new this.google.maps.places.PlacesService(this.map);
    this.service.findPlaceFromQuery(request, this.findPlaceResult);

} 
  findPlaceResult = (results, status) => {
    var placesTemp=[]
    var placeId = ''
    if (status ===  'OK') {
      results.map((place) => {
        var placePhotos=['']
        const placeTemp = {id:place.place_id, name:place.name,
          address:place.formatted_address,photos:placePhotos}
          placeId = place.place_id;
        placesTemp.push(<Place placeData={placeTemp}/>);
      })
    }
    if (placesTemp.length>0)
      this.findPlaceDetail(placeId);
    else{
      const placeTemp = {id:'N/A', name:<div className='mt-5'><strong className='text-center'>
          No hay resultados</strong></div>,
        address:'',photos:['']}
      placesTemp.push(<Place placeData={placeTemp}/>);
      this.setState({places:placesTemp})
    }
  }

  findPlaceDetail = (placeIdFound) => {
    var request = {
      placeId: placeIdFound,
      fields: ['address_component', 'adr_address', 'alt_id', 'formatted_address',
       'icon', 'id', 'name', 'permanently_closed', 'photo', 'place_id', 'plus_code', 'scope', 
       'type', 'url', 'utc_offset', 'vicinity','geometry','rating','reviews','opening_hours']
    };
    this.service.getDetails(request, this.foundPlaceDatail);
  }

  foundPlaceDatail = (place, status) => {
    if (status === 'OK'){
      var placePhotos=['']
      if (place.photos){
        place.photos.map((placePhoto, index) => {
          placePhotos[index]=placePhoto.getUrl({'maxWidth': 160, 'maxHeight': 120})
          if (index === 2) return;
          console.log(placePhoto);
        })
      }
      const placeTemp = {id:place.place_id, name:place.name,
        address:place.formatted_address,photos:placePhotos}
      const placesTemp = <Place placeData={placeTemp}/>;
      const placeHorarios = <Horario horarios={place.opening_hours}/>
      var rating=''
      if (place.rating){
        rating = <Rating placeRating={place.rating} placeReviews={place.reviews}/>
      }
      else{
        rating = <div key={1} className='row mt-2 mb-1 pl-3' >
                  <strong>No hay comentarios</strong>
                 </div>;
                 console.log(placeTemp);
      }
      console.log('address_component: '+ place.address_component, 
      'adr_address: '+place.adr_address, 'alt_id', 'formatted_address', 'geometry: '+place.geometry,
      'icon: '+place.icon, 'permanently_closed', 'photo',' rating: '+place.rating,
      'type: '+place.type, 'url: '+place.url, 'utc_offset', 'vicinity')
      this.setState({places:placesTemp, 
                     placeRating:rating,
                     placeHorarios:placeHorarios})
      this.showMap(place.geometry.location);
      var coordenadas =(place.geometry.location);
      document.getElementById("lat").value = coordenadas.lat();
      document.getElementById("lng").value = coordenadas.lng();
      this.geocodeLatLng();
 
    }
  }

  //PARAMETROS DE BUSQUEDA LUGARES CERCANOS
obtenerLugares(){
    var type =document.getElementById("sel1").value //TIPOS DE LUGARES
    var lat = document.getElementById("lat").value; //LATITUD
    var lng = document.getElementById("lng").value; //LONGITUD
    var latitud = parseFloat(lat);  //PASADO A NUMEROS
    var longitud = parseFloat(lng); //PASADO A NUMEROS

//GENERAMOS JSON CON PARAMETROS DE BUSQUEDA LUGARES CERCANOS
fetch( `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitud},${longitud}&radius=5000&type=${type}&key=AIzaSyDnUW5zZvdg6NSAv_h40saS0ETKWawZldk`)
        

.then((response) => {
        return  response.json();
      })
      .then((datos) => {
          this.setState({cercanos:datos.results});
          var cercanos = datos.results
          cercanos = cercanos.slice(1, 8)
         console.log(cercanos);
        var lugaresCercanos="";
        for (var j = 0; j < cercanos.length; j++) {
          this.setState({
            id: cercanos[j].id,
            name: cercanos[j].name,
            address: cercanos[j].vicinity,
            rating: cercanos[j].rating,
            photos:cercanos[j].photos,
            lat:cercanos[j].geometry.location.lat,
            lng:cercanos[j].geometry.location.lng,
            
          })
          //BUSCAMOS FOTOS DE LUGARES CERCANOS y ALTERNATIVA SI NO EXISTE FOTO
            var picture="";
             if (typeof this.state.photos !== 'undefined'){
              
              var conFotos = (this.state.photos.filter(photos => typeof this.state.photos !== "undefined"  ))
              var html= conFotos[0].photo_reference
              picture= `https://maps.googleapis.com/maps/api/place/photo?maxwidth=160&maxHeight=120&photoreference=${html}&key=AIzaSyDnUW5zZvdg6NSAv_h40saS0ETKWawZldk`;
              
            }else{ 
              
              var sinFotos = './Sin_Foto.png';
              picture = sinFotos
              
              }
    //GENERAMOS TARJETAS DE LUGARES CERCANOS 
          lugaresCercanos += `
               
        <div class="tarjetas" >
            <div class="row ">
              <div class="col-3   cont_photo">
                <img class="photo" src= ${picture}> 
              </div>
              <div class="col-6 tarjetas_datos">               
                  <strong>${this.state.name}</strong></br>
                  ${this.state.address}</br>
                  Calificacion: ${this.state.rating}
              </div>
              <div class="col-3">
              <div class="row">
                  <a class="btnDetalle btn btn-primary text-center btnTarjetas"
                  onClick=(document.getElementById("origen").value=document.getElementById("${this.state.id}").value)
                  >Detalle</a>
              </div>
              <div class="row">
                  <a class="btnDireccion btn btn-primary text-center btnTarjetas"
                  onMouseOver=(document.getElementById("destLat").value=document.getElementById("lat${this.state.id}").value);(document.getElementById("destLng").value=document.getElementById("lng${this.state.id}").value)
                
                  
                  >Indicaciones</a>
              </div>
             <input class="datos" id="${this.state.id}" value="${this.state.name}"></input>
             <input class="datos" id="lat${this.state.id}" value="${this.state.lat}"></input>
             <input class="datos" id="lng${this.state.id}" value="${this.state.lng}"></input>
              </div>
            </div>
        </div>    
            `;
      
            } 
            document.getElementById("name").innerHTML =lugaresCercanos;

    //OBTENEMOS DETALLE DE LUGAR CERCANO SELECCIONADO
    
    if (document.getElementsByClassName("btnDetalle")  !== null){
       var boton = document.getElementsByClassName("btnDetalle")
    
    //EVENTOS BOTON DETALLE
     for (var i = 0 ; i < boton.length; i++) {
   boton[i].addEventListener('click' , this.manejoOnClick , false ) ;
   boton[i].addEventListener('click' , this.closeModal , false ) ;
    }}

    //EVENTOS BOTON DIRECCION
    if (document.getElementsByClassName("btnDireccion")  !== null){
       var btnDireccion = document.getElementsByClassName("btnDireccion")

     for (var k = 0 ; k < btnDireccion.length; k++) {
   btnDireccion[k].addEventListener('click' , this.directions , false ) ;
   btnDireccion[k].addEventListener('click' , this.closeModal , false ) ;
   btnDireccion[k].addEventListener('click',function(evento){
        document.getElementById('mode').style.display ="block";
        document.getElementById('reverseGeocode').style.display="none"
        document.getElementById('floating-panel').style.display ="block";
    })

    //EVENTOS BOTON PUNTOS DE INTERES
     document.getElementById('boton').addEventListener('click', function(evento){
     document.getElementById("right-panel").innerHTML ="";
     document.getElementById('mode').style.display ="none";
     document.getElementById('reverseGeocode').style.display="block";
     document.getElementById('floating-panel').style.display ="none";
    });

     //EVENTOS BOTON BUSCAR LUGAR
     document.getElementById('buscarLugar').addEventListener('click', function(evento){
     document.getElementById("right-panel").innerHTML ="";
     document.getElementById('mode').style.display ="none";
     document.getElementById('reverseGeocode').style.display="block";
     document.getElementById('floating-panel').style.display ="none";
    });
  
     //EVENTOS SELECT DE TIPO DE MEDIO DE TRANSPORTE
   document.getElementById('mode').addEventListener('change', function(evento){
     document.getElementById("right-panel").innerHTML ="";
   })
   document.getElementById('mode').addEventListener('change',this.directions,false);
    }}

    //EVENTOS BOTON MI UBICACION
    document.getElementById('miUbicacion').addEventListener('click', function(event){
    document.getElementById("origen").value = "Mi Ubicacion";
    document.getElementById('mode').style.display ="none";
    document.getElementById('reverseGeocode').style.display="block"
    document.getElementById('floating-panel').style.display ="none";


    })
    document.getElementById('miUbicacion').addEventListener('click', this.manejoOnClick,false);

  })
}
    
render() {
  this.getLocation();

    //if (this.state.logged){
      return (
        
        <div className="App" >

          <div className='container border rounded p-3 mt-4' style={{width:'50%'}}>
              <div className='row'>
                  <div className='col-4'></div>
                  <div className='col-4 text-center'>
                    <label><strong>Indica el lugar</strong></label>
                  </div>
                  <div className='col-4'></div>
              </div>
                    <div className='row'>
                      <div className='col-4'></div>
                      <div className='col-4 py-2'><input id='origen' type='text'/></div><input id="destLat" className="datos"></input><input id="destLng"className="datos"></input>
                      <div className='col-4'></div>
                    </div>
                    <div className='row'>
                      <div className='col-4'>
                        <div className='mb-3 btn btn-primary' onClick={this.openModal}id='boton'> Punto de interes</div>
                      
                      </div>
                      <div className='col-4 text-center'>
          
                        <div id="buscarLugar"className='btn btn-primary text-center' onClick={this.manejoOnClick}>Buscar Lugar</div>
                      </div>
                      <div className='col-4 text-center'>
                        <div id="miUbicacion"className='btn btn-primary text-center'>Mi Ubicacion</div>
                      </div>
                    
                    </div> 
                    {this.state.places}
                    {this.state.placeHorarios}
                    {this.state.placeRating}
                    <div>
            
                <div id="floating-panel">
                  <select id="mode"onchange={this.directions}>
                    <option value='DRIVING'>Automovil</option>
                    <option value='WALKING'>Caminando</option>
                    <option value='BICYCLING'>Bicicleta</option>
                    <option value='TRANSIT'>Transporte Publico</option>
                  </select>
                </div>
                    <div><input id="reverseGeocode" className="infoMarker"></input></div>
                    <div id="map"></div>
                    <div id="right-panel"></div>
                  </div>
                    <div className="coords">
        
                    <div>
                      <div id="directionsPanel"></div>
                    </div>
        
                    </div>
            
          </div>
            <Modal
              isModalOpen={this.state.isModalOpen}
              closeModal={this.closeModal}>
              <div className="col-12">
                <div className="col-12">
                    <div className="col-12">
                        <div className="d-flex flex-row bd-highlight mb-3"> 
                            <div className="p-2 bd-highlight">
                              <a id="Pinteres"className='btn btn-primary text-center'onClick={this.obtenerLugares} >Buscar Punto de Interes</a>
                            </div>
                            
                            <div className="p-2 bd-highlight">
                              <Types></Types>
                            </div>
                        </div>
                    </div>
                    <div className="col-12 ">
                      <div id="name"className="col-12  panelModal"></div>
                      <input id="comprobacion" className="datos"></input>
                    </div>
                  </div>  
              </div>
            </Modal>
            <div> <input type="text" id="lng"className="datos" ></input></div> 
            <div> <input type="text"id="lat"className="datos" ></input></div>      
        </div>
        
      );
    
    }
   /* else {
      return (
        <FB_Login loginStatus={this.loginStatus}/>
      );
    }
  }*/
}
export default App;