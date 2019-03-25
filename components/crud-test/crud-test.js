const should = require('should');

module.exports = {test};

const testValue1 = 'testValue1';
const testValue2 = 'testValue2';
 
function test(crud, clean, object1, object2, done) {
  clean(null, err => {
    should.not.exist(err);

    object1.testValue = testValue1;
    crud.save(object1, err => {
      should.not.exist(err);

      crud.readList(null, (err, docs1) => {
        should.not.exist(err);
        should.equal(docs1.length, 1);

        crud.read(docs1[0]._id, (err, doc1) => {
          should.not.exist(err);
          should.deepEqual(doc1._id, docs1[0]._id);
          should.equal(doc1.testValue, testValue1);
  
          object2._id = doc1._id;
          object2.testValue = testValue2;
          crud.save(object2, err => {
            should.not.exist(err);
      
            crud.readList(null, (err, docs2) => {
              should.not.exist(err);
              should.equal(docs2.length, 1);
      
              crud.read(doc1._id, (err, doc2) => {
                should.not.exist(err);
                should.deepEqual(doc2._id, doc1._id);
                should.equal(doc2.testValue, testValue2);
        
                crud.remove(doc2._id, err => {
                  should.not.exist(err);
            
                  crud.readList(null, (err, docs3) => {
                    should.not.exist(err);
                    should.equal(docs3.length, 0);
            
                    crud.read(doc2._id, (err, doc3) => {
                      should.not.exist(err);
                      should.not.exist(doc3);
              
                      done()
                    });  
                  });  
                })
              });  
            });  
          })
        });  
      });  
    })
  });
}