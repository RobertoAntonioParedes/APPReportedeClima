const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');

window.addEventListener('load', ()=>{
    formulario.addEventListener('submit', buscarClima);
});


function buscarClima(e){
    e.preventDefault();

    //Validar
    const ciudad = document.querySelector('#ciudad').value;
    const pais = document.querySelector('#pais').value;
    if(ciudad === '' || pais === ''){
        mensajeAlerta('Todos los campos son obligatorios');
        return;
    }

    //consultar API
    consultarApi(ciudad, pais);
};

function mensajeAlerta(mensaje){
    const alerta = document.querySelector('br-red-100');
    if(!alerta){
        const divAlerta = document.createElement('DIV');
        divAlerta.classList.add('bg-red-100', 'border-red-400', 'text-red-700', 'px-4', 'py-3', 'rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center');
        divAlerta.innerHTML = `
        <strong class="font-bold">¡ERROR!</strong>
        <span class="block">${mensaje}</span>
        `
        formulario.appendChild(divAlerta);
        //container.appendChild(alerta)

        //Se elimine la alerta
        setTimeout(()=>{
            divAlerta.remove();
        }, 3500); 
    };
};

function consultarApi(ciudad, pais){

    const appId = 'ab9ffe190165bb134414c1a082c434fc'

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${ciudad},${pais}&appid=${appId}`

    spinner(); //Muestra un spinner donde carga el servidor

    fetch(url)
        .then(resultado=>resultado.json())
        .then(datos=>{
            console.log(datos);
            limpiarHtml(); //Limpiar el html previo
            if(datos.cod === "404"){
                mensajeAlerta('Ciudad no existe');
                return;
            };

            //Imprime la respuesta en el HTML
            mostrarClima(datos);
        });
};

function mostrarClima(datos){
    const {name, main:{temp, temp_max, temp_min}}= datos;
    const centigrados = kelvinACentigrado(temp);
    const max = kelvinACentigrado(temp_max);
    const min = kelvinACentigrado(temp_min);

    const actual = document.createElement('P');
    actual.innerHTML = `${centigrados} &#8451;`;
    actual.classList.add('font-bold', 'text-6xl');

    const tempMax = document.createElement('P');
    tempMax.innerHTML = `Max: ${max} &#8451;`;
    tempMax.classList.add('text-xl');

    const tempMin = document.createElement('P');
    tempMin.innerHTML = `Min: ${min} &#8451;`;
    tempMin.classList.add('text-xl');

    const ciudad = document.createElement('P');
    ciudad.textContent= `Clima en: ${name}`;
    ciudad.classList.add('font-bold', 'text-2xl');

    const resultadoDiv = document.createElement('DIV');
    resultadoDiv.classList.add('text-center', 'text-white');
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(tempMax);
    resultadoDiv.appendChild(tempMin);
    resultadoDiv.appendChild(ciudad);
    resultado.appendChild(resultadoDiv);
};

const kelvinACentigrado = grados => parseInt(grados -273.15);


function limpiarHtml(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
};

function spinner(){
    limpiarHtml();

    const cargarSpinner = document.createElement('DIV');
    cargarSpinner.classList.add('spinner');
    cargarSpinner.innerHTML = `
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
    `;
    resultado.appendChild(cargarSpinner);
}