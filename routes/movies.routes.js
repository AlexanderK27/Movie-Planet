const { Router } = require('express')
// const multer = require('multer')
const Movie = require('./../models/Movie')
const Hall = require('./../models/Hall')
const router = Router()

router.get('/now', async (req, res) => {
    const timeNow = Math.round(new Date().getTime()/1000.0)
    const oneWeakLater = timeNow + 604800
    try {
        const movies = await Movie.find(
            { 
                endDate: {$gte: timeNow}, 
                startDate: {$lte: oneWeakLater}
            },
            { 
                "description.name": 1,
                "description.genres": 1,
                "description.stars": 1,
                startDate: 1,
                endDate: 1,
                schedule: 1
            }
        )
        if (movies.length === 0) {
            return res.json({ message: 'No movies are playing now'})
        }
        res.json(movies)
    } catch (e) {
        res.status(500).json({ message: 'Something went wrong, try again later' })
    }
})

router.get('/soon', async (req, res) => {
    const timeNow = Math.round(new Date().getTime()/1000.0)
    
    try {
        const movies = await Movie.find( 
            { startDate: {$gte: timeNow} }, 
            { 
                startDate: 1, 
                "description.name": 1,
                "description.genres": 1, 
                "description.production": 1,
                "description.stars": 1   
            }
        ).sort({ startDate: 1 })

        if (movies.length === 0) {
            return res.json({ message: 'These are all movie premieres we know about'})
        }

        res.json(movies)
    } catch (e) {
        res.status(500).json({ message: 'Something went wrong, try again later' })
    }    
})

router.get('/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id, { 
            schedule: 0, 
            "description.poster": 0,
            startDate: 0,
            endDate: 0  
        })
        if (!movie) {
            return res.status(404).json({ message: 'No movie found for your request' })
        }
        res.json(movie)
    } catch (e) {
        res.status(500).json({ message: 'Something went wrong, try again later' })
    }
})

router.get('/session/:id', async (req, res) => {
    if (!req.query.mv) {
        return res.status(400).send()
    }

    try {
        const movie = await Movie.findById(req.query.mv)

        let session = {}
        for (let day of movie.schedule) {
	        let ses = day.sessions.find(({ _id }) => _id.toString() === req.params.id )
            if (ses) {
                session = ses
                break
            }
        }

        const hall = await Hall.findById(session.hall)

        res.json({session, hall})
    } catch (e) {
        res.status(500).json({ message: 'Something went wrong, try again later' })
    }
})

router.get('/hall/:id', async (req, res) => {
    try {
        const hall = await Hall.findById(req.params.id)
        res.json(hall)
    } catch (e) {
        res.status(500).json({ message: 'Something went wrong, try again later' })
    }
})

router.get('/poster/:id', async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id)

        if (!movie || !movie.description.poster) {
            return res.status(404).json({ message: 'Could not find such poster' })
        }

        res.set('Content-Type', 'image/jpg')
        res.send(movie.description.poster)
    } catch (e) {
        res.status(404).send()
    }
})

// router.post('/admin/add/movie', async(req, res) => {
//     const movie = new Movie(req.body)
//     try {
//         await movie.save()
//         res.status(201).send(movie)
//     } catch (e) {
//         res.status(500).json({ message: 'Something went wrong, try again later' })
//     }
// })

// router.post('/admin/add/hall', async(req, res) => {
//     const hall = new Hall(req.body)
//     try {
//         await hall.save()
//         res.status(201).send(hall)
//     } catch (e) {
//         res.status(500).json({ message: 'Something went wrong, try again later' })
//     }
// })

// const upload = multer()

// router.post('/admin/add/poster/:id', upload.single('poster'), async(req, res) => {
//     try {
//         const movie = await Movie.findById(req.params.id)
   
//         movie.description.poster = req.file.buffer
//         await movie.save()
//         res.json({ message: 'Poster inserted'})
//     } catch (e) {
//         res.status(500).json({ message: 'Something went wrong, try again later' })
//     }
// })

module.exports = router