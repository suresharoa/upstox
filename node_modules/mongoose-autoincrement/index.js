'use strict';

var autoIncrement = function(schema, options) {
  schema.add({
    _id: { type: Number, unique: true }
  });

  schema.pre('save', function(next) {
    var doc = this;
    if (doc.isNew) {
      doc._id = getNextSeq(doc.db.db, doc.collection.name, function(err, seq) {
        if (err) next(err);
        doc._id = seq;
        next();
      });
    }
  });
};

var getNextSeq = function(db, name, callback) {
  db.collection('counters').findAndModify(
    { _id: name },
    { _id: -1 },
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
    function (err, ret) {
      if (err) callback(err);
      callback(null, ret.value.seq);
    });
};

module.exports = autoIncrement;
