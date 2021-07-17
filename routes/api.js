const router = require("express").Router();
const Workout = require("../models/workouts");
const path = require("path");

router.post("/api/workouts", (req, res) => {
  Workout.create({})(req.body)
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

router.get('/api/workouts', (req, res) => {
  Workout.aggregate([
    {
      $addFields: {
        totalDuration: {
          $sum: '$exercises.duration',
        },
      },
    },
  ])
    .then((dbWorkouts) => {
      res.json(dbWorkouts);
    })
    .catch((err) => {
        console.log(err)
      res.json(err);
    });
});

router.put('/api/workouts/:id', async (req, res) => {
	try {
		const workout = await Workout.findById(req.params.id)
		workout.exercises.push(req.body)
		await workout.save()
		res.status(200).json(workout)
	}
	catch (err) {
		console.log(err)
		res.status(400).json(err)
	}
});

router.get("/api/workouts/range", (req, res) => {
  Workout.aggregate([
    {$addFields:{totalDuration:{$sum:'$exercises.duration'}}}
  ])
  .sort({ _id: -1 })
  .limit(7)
  .then(dbWorkout => {
      console.log("test")
      res.json(dbWorkout);
  })
  .catch(err => {
      res.status(400).json(err);
  });
});




     
module.exports = router;
