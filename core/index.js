const Jimp  = require('jimp')
const fs = require('fs')
const path = require('path')

const PATH_PATH = '../images/path.png'

const src = process.argv[2]
const ratio = process.argv[5] || 3

if(src == undefined || process.argv.length < 3 ) throw "Please provide a src image"

console.log(`Processing image: ${src}`)

if(!fs.existsSync(src)) throw "Path not valid"

const dir = path.dirname(src)
const name = path.basename(src)
const name_splitted = name.split('.')

mode = {
    h : process.argv[3] || 'center',
    v : process.argv[4] || 'center'
}

console.log(`Path will be placed ${mode.h}-${mode.v}`)
// map from mode value to a function that returns the correct value position
const mode_to_value = {
    'left' : () => 0,
    'center_h': ({width}, path) => width/2 - path.bitmap.width / 2,
    'center_v': ({height}, path) => height/2 - path.bitmap.height / 2,
    'right': ({width}, path) => width - path.bitmap.width,
    'up': () => 0,
    'down': ({height}, path) => height - path.bitmap.height,
}

function getPositon({ h, v }, image, path) {
    
    x = mode_to_value[ h == 'center' ? 'center_h' : h](image.bitmap, path)
    y = mode_to_value[v == 'center' ? 'center_v' : v](image.bitmap, path)

    return { x, y }
}

Promise.all([Jimp.read(PATH_PATH), Jimp.read(src)])
.then(images => {
    const path = images[0]
    const image = images[1]
    const save_path = `${dir}/${name_splitted[0]}-pathed.${name_splitted[1]}`

    path.resize(image.bitmap.width / ratio, Jimp.AUTO)
    position = getPositon(mode, image, path)
    image.composite(path, position.x, position.y)
    image.write(save_path)

    console.log(`Image saved at: ${save_path}`);
})
.catch(err => console.error(err)) 
