const router = require("express").Router();
const Workout = require("../models/workouts");
const path = require("path");

router.post("/api/workouts", (req, res) => {
	Workout.create({}).then(workout => {
		res.json(workout);
	}).catch(err => {
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

router.put('/api/workouts/:id', (req, res) => {
Workout.findByIdAndUpdate(
  req.params.id,
  {$push: {exercies:req.body}},
  {new:true, runValidators:true}
)
.then((dbWorkouts) => {
  res.json(dbWorkouts);
})
.catch((err) => {
    console.log(err)
  res.json(err);
});
});

router.get("/api/workouts/range", (req, res) => {
  Workout.aggregate([
    {$addFields:
      {totalDuration:
        {$sum:'$exercises.duration'}}}
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
