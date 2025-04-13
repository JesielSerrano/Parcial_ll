const readlineSync = require('readline-sync')
const chalk = require('chalk')
const fs = require('fs')

let catalogo = []

function agregarLibro() {
  const titulo = readlineSync.question('Titulo: ')
  const autor = readlineSync.question('Autor: ')
  let precio = parseFloat(readlineSync.question('Precio: '))
  while (isNaN(precio) || precio <= 0) {
    precio = parseFloat(readlineSync.question(chalk.red('Precio invalido. Ingrese un numero positivo: ')))
  }
  let anio = parseInt(readlineSync.question('Anio de publicacion: '))
  while (isNaN(anio)) {
    anio = parseInt(readlineSync.question(chalk.red('Anio invalido. Ingrese un numero: ')))
  }
  const libro = { titulo, autor, precio, anio }
  catalogo.push(libro)
  console.log(chalk.green('Libro agregado correctamente.'))
}

function mostrarCatalogo() {
  if (catalogo.length === 0) {
    console.log(chalk.red('El catalogo esta vacio.'))
    return
  }
  catalogo.forEach((libro, i) => {
    console.log(chalk.yellow(`${i + 1}. ${libro.titulo} - ${libro.autor} - Q${libro.precio} - ${libro.anio}`))
  })
}

function buscarLibro() {
  const titulo = readlineSync.question('Ingrese el titulo del libro: ')
  const libro = catalogo.find(l => l.titulo.toLowerCase() === titulo.toLowerCase())
  if (libro) {
    console.log(chalk.yellow(`Titulo: ${libro.titulo}`))
    console.log(`Autor: ${libro.autor}`)
    console.log(`Precio: Q${libro.precio}`)
    console.log(`Anio: ${libro.anio}`)
  } else {
    console.log(chalk.red('Libro no encontrado.'))
  }
}

function eliminarLibro() {
  const titulo = readlineSync.question('Ingrese el titulo del libro a eliminar: ')
  const index = catalogo.findIndex(l => l.titulo.toLowerCase() === titulo.toLowerCase())
  if (index !== -1) {
    catalogo.splice(index, 1)
    console.log(chalk.green('Libro eliminado correctamente.'))
  } else {
    console.log(chalk.red('Libro no encontrado.'))
  }
}

function verEstadisticas() {
  const total = catalogo.length
  const promedio = catalogo.reduce((acc, libro) => acc + libro.precio, 0) / total || 0
  const masAntiguo = catalogo.reduce((a, b) => a.anio < b.anio ? a : b, catalogo[0])
  const masCaro = catalogo.reduce((a, b) => a.precio > b.precio ? a : b, catalogo[0])
  console.log(chalk.cyan(`Cantidad total de libros: ${total}`))
  console.log(chalk.cyan(`Precio promedio: Q${promedio.toFixed(2)}`))
  if (catalogo.length > 0) {
    console.log(chalk.cyan(`Libro mas antiguo: ${masAntiguo.titulo} (${masAntiguo.anio})`))
    console.log(chalk.cyan(`Libro mas caro: ${masCaro.titulo} (Q${masCaro.precio})`))
  }
}

function ordenarLibros() {
  console.log(chalk.bold('\nOpciones de ordenamiento'))
  console.log('1. Precio ascendente')
  console.log('2. Precio descendente')
  console.log('3. Anio de publicacion')
  const opcion = readlineSync.question('Seleccione una opcion: ')
  switch (opcion) {
    case '1':
      catalogo.sort((a, b) => a.precio - b.precio)
      break
    case '2':
      catalogo.sort((a, b) => b.precio - a.precio)
      break
    case '3':
      catalogo.sort((a, b) => a.anio - b.anio)
      break
    default:
      console.log(chalk.red('Opcion no valida'))
      return
  }
  console.log(chalk.green('Libros ordenados.'))
  mostrarCatalogo()
}

function editarLibro() {
  const titulo = readlineSync.question('Ingrese el titulo del libro a editar: ')
  const libro = catalogo.find(l => l.titulo.toLowerCase() === titulo.toLowerCase())
  if (libro) {
    libro.titulo = readlineSync.question(`Nuevo titulo (${libro.titulo}): `) || libro.titulo
    libro.autor = readlineSync.question(`Nuevo autor (${libro.autor}): `) || libro.autor
    let nuevoPrecio = readlineSync.question(`Nuevo precio (${libro.precio}): `)
    if (nuevoPrecio) libro.precio = parseFloat(nuevoPrecio)
    let nuevoAnio = readlineSync.question(`Nuevo anio (${libro.anio}): `)
    if (nuevoAnio) libro.anio = parseInt(nuevoAnio)
    console.log(chalk.green('Libro actualizado.'))
  } else {
    console.log(chalk.red('Libro no encontrado.'))
  }
}

function guardarCatalogoEnArchivo() {
  fs.writeFileSync('catalogo.json', JSON.stringify(catalogo, null, 2))
  console.log(chalk.green('Catalogo guardado en catalogo.json'))
}

function filtrarPorAutor() {
  const autor = readlineSync.question('Ingrese el autor a filtrar: ')
  const libros = catalogo.filter(l => l.autor.toLowerCase() === autor.toLowerCase())
  if (libros.length === 0) {
    console.log(chalk.red('No se encontraron libros de ese autor.'))
  } else {
    libros.forEach((libro, i) => {
      console.log(chalk.yellow(`${i + 1}. ${libro.titulo} - Q${libro.precio} - ${libro.anio}`))
    })
  }
}

function mostrarMenu() {
  console.log(chalk.bold.blue('\nMenu Principal'))
  console.log('1. Agregar libro')
  console.log('2. Mostrar catalogo')
  console.log('3. Buscar libro por titulo')
  console.log('4. Eliminar libro')
  console.log('5. Ver estadisticas')
  console.log('6. Ordenar libros')
  console.log('7. Editar libro')
  console.log('8. Guardar catalogo en archivo')
  console.log('9. Filtrar por autor')
  console.log('10. Salir')
}

function main() {
  let salir = false
  while (!salir) {
    mostrarMenu()
    const opcion = readlineSync.question('Seleccione una opcion: ')
    switch (opcion) {
      case '1':
        agregarLibro()
        break
      case '2':
        mostrarCatalogo()
        break
      case '3':
        buscarLibro()
        break
      case '4':
        eliminarLibro()
        break
      case '5':
        verEstadisticas()
        break
      case '6':
        ordenarLibros()
        break
      case '7':
        editarLibro()
        break
      case '8':
        guardarCatalogoEnArchivo()
        break
      case '9':
        filtrarPorAutor()
        break
      case '10':
        salir = true
        console.log(chalk.green('Programa finalizado.'))
        break
      default:
        console.log(chalk.red('Opcion no valida.'))
    }
  }
}

main()
