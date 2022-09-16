const express = require('express');
const exphbs = require('express-handlebars');
const pool = require('./db/conex');


const app = express();


app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json());



app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

app.use(express.static('public'))

app.get('/', (req, res) => {

    res.render('home')
})


app.post('/livros/iserindolivro', (req, res) => {

//dados que vem do corpo da requisisção
const titulo = req.body.titulo;
const qntpages = req.body.qntpages;

//query que é instrução do banco de dados
//const sql =`INSERT INTO livros (titulo, qntpages) VALUES ('${titulo}', '${qntpages}')`
//segurança para não sofrer sql injection colocamos 2 ? para coluna e ? para dados
const sql =`INSERT INTO livros (??, ??) VALUES (?, ?)`
//criamso essa constante com um array para passar os dados passar data na query abaixo
const data = ['titulo', 'qntpages', titulo, qntpages]


//execução da query
pool.query(sql, data, function(err){
    if(err){
        console.log(err);
        return;
        }

        res.redirect('/livros')

})
})
//resgatando os dados do banco
app.get('/livros', (req, res) => {

    const sql = "SELECT * FROM livros"
    pool.query(sql, function(err, date){
        if(err){
            console.log(err);
            return;
            }
    
        const livros = date
        console.log(livros)

        res.render('livros', {livros})
    
    })

})

//resgatando dados com filtro do banco
app.get('/livros/:id', (req, res) => {

    const id = req.params.id

    const sql = `SELECT * FROM livros WHERE ?? = ?`
    const data = ['id', id]

    pool.query(sql, data, function(err, date){
        if(err){
            console.log(err);
            return
        }

        const livro = date[0]

        res.render('livro', {livro})

    })
})

//editando dados puxando para o form
app.get('/livros/edit/:id', (req, res) => {

    const id = req.params.id

    const sql = `SELECT * FROM livros WHERE ?? = ?`
    const data = ['id', id]

    pool.query(sql, data, function(err, date){
        if(err){
            console.log(err);
            return
        }

        const livro = date[0]
        res.render('editlivro', {livro})
    })

})

//criandoo update fazendo os dados do form serem puxados para o banco
app.post('/livros/updatelivro', (req, res) => {

    
    const id = req.body.id
    const titulo = req.body.titulo
    const qntpages = req.body.qntpages;

   // const sql = `UPDATE livros SET titulo = '${titulo}', qntpages = '${qntpages}' WHERE id = ${id}`;
    const sql = `UPDATE livros SET ?? = ?, ?? = ? WHERE ?? = ?`;
    const data = ['titulo', titulo, 'qntpages', qntpages, 'id', id]

    


    
    pool.query(sql, data, function(err, date){
        if(err){
            console.log(err);
            return
        }
         
        
        
        res.redirect('/livros')
        
        
    })

})

app.post('/livros/remove/:id', (req, res) => {

    const id = req.params.id

    const sql = `DELETE FROM livros WHERE ?? = ?`
    const data = ['id', id]

    pool.query(sql, date, function(err) {
        if(err){
            console.log(err);
            return
        }

        res.redirect('/livros')
    })

})


app.listen(3000, () => {
    console.log('Servidor iniciado')
})