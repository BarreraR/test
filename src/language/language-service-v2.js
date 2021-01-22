const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score',
      )
      .where('language.user_id', user_id)
      .first()
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count',
      )
      .where({ language_id })
      .orderBy('id')
  },

  getLanguageHead(db, language_id, head_id){
    return db 
      .from('word')
      .select('*')
      .where(
        'id', '=', head_id, 
        'language_id', '=', language_id
      )
      .first()
  },















































  // fix these ffs
  updateWords(db, data){
    db.transaction(function(t){
       db('word')
        .transacting(t)
        .where('id', '=', data.prev_node_id)
        .update({'next':data.prev_node_next})
        .then(function() {
          db('word')
          .transacting(t)
          .where('id', '=', data.old_head.id)
          .update({'next': data.old_head.next, 
              'memory_value': data.old_head.memory_value,
              'correct_count': data.old_head.correct_count,
              'incorrect_count': data.old_head.incorrect_count 
          })
        })
        .then(t.commit)
        .catch(function(e){
          t.rollback();
          throw e;
        })
    })
    .then(function(){
      //it worked
    })
    .catch(function(e) {
      // it failed
    })
  //     try{
  //       db('word')
  //         .transacting(t)
  //         .where('id', '=', data.prev_node_id)
  //         .update({'next':data.prev_node_next})
  //       db('word')
  //         .transacting(t)
  //         .where('id', '=', data.old_head.id)
  //         .update({'next': data.old_head.next, 
  //             'memory_value': data.old_head.memory_value,
  //             'correct_count': data.old_head.correct_count,
  //             'incorrect_count': data.old_head.incorrect_count 
  //         })
  //       t.commit()
  //       // return db('word').select('*')
  //     } catch (e) {
  //       t.rollback();
  //       // As you can see, if you don't rethrow here
  //       // the outer catch is never triggered
  //       throw e;
  //     }
  //   // It worked
  // } catch (e) {
  //   //It failed
  // }
      
    
    // db
    //   .from('word')
    //   .where('id', data.prev_node_id)
    //   .update('next', '=', data.prev_node_next)

    // db  
    //   .from('word')
    //   .where('id', data.old_head.id)
    //   .update({'next': data.old_head.next, 
    //     'memory_value': data.old_head.memory_value,
    //     'correct_count': data.old_head.correct_count,
    //     'incorrect_count': data.old_head.incorrect_count 
    //   })

    // return db('word').select('*')
  },

  updateLanguage(db, language_id, score, head_id){
    console.log('total_score', score, 
    'head', head_id, 'id', language_id)
    db
      .from('language')
      .where('id', '=', language_id)
      .update({
        'total_score': score, 
        'head': head_id
      })
    //   console.log(lan)

    // return score;
  },
}
module.exports = LanguageService
