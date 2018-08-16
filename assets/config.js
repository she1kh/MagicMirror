module.exports = (app) => {

    const mongojs = require('mongojs');
    var db = mongojs('mongodb://ussiling:H3jmongo@ds018848.mlab.com:18848/mirrordb');
    var city = db.collection('city');
    var moto = db.collection('moto');
    var todos = db.collection('todo');
    const bodyParser = require('body-parser');

    var urlencodedParser = bodyParser.urlencoded({extended: false});

    app.get('/config', (req, res) => {
        res.render('config');
    });

    app.post('/config', urlencodedParser, (req, res) => {
        console.log(req.body.city);
        if(req.body.city != undefined){
            city.save({"city": req.body.city,
            "dt": new Date().getTime() })
        }else if(req.body.moto != undefined){
            moto.save({"moto": req.body.moto,
            "dt": new Date().getTime() })
        }else if(req.body.todo != undefined){
            todos.save({"item": req.body.todo,
            "isDone": false,
            "dt": new Date().getTime() });
        };
        //
        res.render('config',{msg : 'Msg sent'})
    });

    app.delete('/config', () => {

    });
            

};