const Lesson = require("../models/lesson");

exports.createLesson = (req, res, next) => {
  // const lesson=req.body;
  console.log(req.body);
  const lesson = new Lesson({
    lessonName: req.body.lessonName,
    creator: req.userData.userId,
  });
  console.log("lesson=", lesson);
  console.log("lesson=", lesson);
  lesson
    .save()
    .then((createdLesson) => {
      console.log("lesson added success");
      console.log(createdLesson._id);
      res.status(201).json({
        message: "Lesson added successfully!",
        lessonId: createdLesson._id,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Creating a Lesson failed!" });
    });
};

exports.updateLesson = (req, res, next) => {
  const lesson = new Lesson({
    _id: req.body._id,
    lessonName: req.body.lessonName,
    creator: req.userData.userId,
  });
  Lesson.updateOne({ _id: req.params.id, creator: req.userData.userId }, lesson)
    .then((result) => {
      console.log("updateLesson");
      console.log(result);
      if (result.matchedCount > 0) {
        res.status(200).json({ message: "Lesson updated successfully!" });
      } else {
        res.status(401).json({ message: "Not Authorized" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Updating a Lesson failed!" });
    });
};

exports.getLessons = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.currentpage;
  const lessonQuery = Lesson.find();
  let fetchedLessons;
  if (pageSize && currentPage) {
    lessonQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  lessonQuery
    .then((documents) => {
      fetchedLessons = documents;
      return Lesson.count();
    })
    .then((count) => {
      res.status(200).json({
        message: "Lesson fetched successfully",
        lessons: fetchedLessons,
        maxLessons: count,
      });
    })
    .catch((error) => {
      res.status(500).json({ message: "Fetching Lessons failed!" });
    });
};

exports.getLesson = (req, res, next) => {
  Lesson.findById(req.params.id)
    .then((lesson) => {
      if (lesson) {
        res.status(200).json({ lesson: lesson });
      } else {
        res.status(404).json({ message: "Lesson not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Fetching Lesson failed!" });
    });
};

exports.getLessonsOnly = (req, res, next) => {
  Lesson.find({ creator: req.userData.userId })
    .select({ lessonName: 1, _id: 0 })
    .then((lesson) => {
      if (lesson) {
        res.status(200).json({ lessonsOnly: lesson });
      } else {
        res.status(404).json({ message: "Extracting lessons only not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Fetching lessons only failed!" });
    });
};

exports.deleteLesson = (req, res, next) => {
  Lesson.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((result) => {
      // console.log("onDelete")
      // console.log(result);
      if (result.deletedCount > 0) {
        res.status(200).json({ message: "Lesson Deleted successfully!" });
      } else {
        res.status(401).json({ message: "Not Authorized" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "Deleting the Lesson failed!" });
    });
};

exports.searchLesson = (req, res, next) => {
  console.log(req.query);

  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.currentpage;
  const searchText = req.query.searchtext;

  console.log(req.query);
  console.log(searchText);

  let lessonQuery = Lesson.find();
  let fetchedLessons;

  if (searchText) {
    console.log("inside");
    console.log(searchText);
    if (searchText != "") {
      var regexValue = ".*" + searchText.toLowerCase().trim() + ".*";
      const CheckValue = new RegExp(regexValue, "i");

      lessonQuery = Lesson.find({ lessonName: CheckValue });
    }
  }

  lessonQuery
    .then((lessons) => {
      lessonsCount = lessons.length;
      console.log("inside lessons - Count");
      // console.log(lessonsCount)
      if (pageSize && currentPage) {
        lessonQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
        // console.log("inside pagination")
      }
      lessonQuery
        .clone()
        .then((lessons) => {
          fetchedLessons = lessons;
          // console.log("inside lessons")
          //console.log(lessons.length)
          //console.log(fetchedLessons.length)
        })
        .then((count) => {
          console.log("inside count");
          // console.log(count)
          // FOR DUMMY USE 'COUNT = '
          if (searchText != "" || typeof searchText != "undefined") {
            count = fetchedLessons.length;
            // console.log(count)
          }
          // console.log("lessonsCount=",lessonsCount)
          // console.log("count=",count)
          res.status(200).json({
            message: "Filtered Lessons fetched successfully",
            lessons: fetchedLessons,
            maxLessons: lessonsCount,
          });
        })
        .catch((error) => {
          console.log(error); //console.log("Unable to get filtered lessons")
          res
            .status(500)
            .json({ message: "Failed to fetch filtered Lessons!" });
        });
    })
    .catch((error) => {
      console.log(error);
      console.log("Unable to get lessonsCount");
      res.status(500).json({ message: "Failed to fetch Lessons Count!" });
    });
};

exports.getLessonsTotalcount = (req, res, next) => {
  console.log("lessons count");

  Lesson.count()
    .then((totalCount) => {
      res.status(200).json({
        message: "Total no of Lessons fetched successfully",
        totalLessons: totalCount,
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Fetching Total no of Lessons failed!" });
    });
};
