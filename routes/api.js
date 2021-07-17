const router = require("express").Router();
const Workout = require("../models/workouts");

router.post("/api/workouts", (req, res) => {
  Workout.create(req.body)
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

router.get("/api/workouts", (req, res) => {
  Workout.aggregate([
    {$addFields:{totalDuration:{$sum:'$exercises.duration'}}}
  ])
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.json(err);
    });
});

router.put("/api/workouts/:id", ({params, body }, res) => {
  Workout.findByIdAndUpdate(params.id, {$push:{exercises:body}}, {new:true})
    .then(dbWorkout => {
      res.json(dbWorkout);
    })
    .catch(err => {
      res.status(400).json(err);
    });
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
