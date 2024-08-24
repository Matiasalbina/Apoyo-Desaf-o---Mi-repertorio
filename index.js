const express = require('express');
const morgan = require('morgan');
const fs = require('fs');

const app = express();
app.use(morgan('dev'));
app.use(express.json());

// para leer las canciones---------------------------
app.get('/canciones', (req, res) => {
    const canciones = JSON.parse(fs.readFileSync('repertorio.json', 'utf8'));
    res.json(canciones);
});


// Agregamos una nueva cancion------------------------
app.post('/canciones', function (req, res) {
    try {
        const canciones = JSON.parse(fs.readFileSync('repertorio.json', 'utf-8'));
        const nuevaCancion = req.body;
        canciones.push(nuevaCancion);
        fs.writeFileSync('repertorio.json', JSON.stringify(canciones));
        res.send(nuevaCancion);
    } catch (error) {
        console.error('Error al agregar la canción:', error);
        res.status(500).send({ error: 'Error interno del servidor' });
    }
});

// Para editar-------------------------------------------
app.put('/canciones/:id', function (req, res) {
    try {
        const id = parseInt(req.params.id);
        let canciones = JSON.parse(fs.readFileSync('repertorio.json', 'utf-8'));
        const index = canciones.findIndex(c => c.id === id);

        if (index !== -1) {
            canciones[index] = { ...canciones[index], ...req.body };
            fs.writeFileSync('repertorio.json', JSON.stringify(canciones));
            res.send(canciones[index]);
        } else {
            res.status(404).send({ error: 'Canción no encontrada' });
        }
    } catch (error) {
        console.error('Error al actualizar la canción:', error);
        res.status(500).send({ error: 'Error interno del servidor' });
    }
});

// Eliminamos una cancion---------------------------
app.delete('/canciones/:id', function (req, res) {
    try {
        const id = parseInt(req.params.id);
        let canciones = JSON.parse(fs.readFileSync('repertorio.json', 'utf-8'));
        const nuevaLista = canciones.filter(c => c.id !== id);

        if (canciones.length !== nuevaLista.length) {
            fs.writeFileSync('repertorio.json', JSON.stringify(nuevaLista));
            res.send({ message: 'Canción eliminada con éxito' });
        } else {
            res.status(404).send({ error: 'Canción no encontrada' });
        }
    } catch (error) {
        console.error('Error al eliminar la canción:', error);
        res.status(500).send({ error: 'Error interno del servidor' });
    }
});


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
// Iniciar el servidor
app.listen(3000, () => {
    console.log('server on http://localhost:3000');
});

  
