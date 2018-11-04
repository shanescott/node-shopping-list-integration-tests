
const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, closeServer, runServer} = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Recipes', function() {

    before(function() {
        return runServer();
      });
    
      after(function() {
        return closeServer();
      });

    it('should list recipes on GET', function() {
        return chai.request(app)
        .get('/Recipes')
        .then(function(res) {
            expect(res).to.have.status(200);
            expect(res).to.be.json;
            expect(res.body).to.be.a('array');
            expect(res.body.length).to.be.at.least(1);
            const expectedKeys = ['name', 'ingredients'];
            res.body.forEach(function(item) {
                expect(item).to.be.a('object');
                expect(item).to.include.keys(expectedKeys);
            });
        });
    });

    it('should add a recipe on POST', function() {
        const newRecipe = {name: 'Dark and Stormy', ingredients: ['2oz Dark Rum', '0.5 oz Fresh Lime Juice', 'Ice', 'candied ginger slice', '3 oz chilled ginger beer', '1 lime wheel'] };
        return chai.request(app)
        .post('/recipes')
        .send(newRecipe)
        .then(function(res) {
            expect(res).to.have.status(201);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body).to.include.keys('name', 'ingredients');
            expect(res.body.id).to.not.equal(null);
            expect(res.body).to.deep.equal(Object.assign(newRecipe, {id: res.body.id}));
        });
    });

    it('should update recipes on PUT', function() {
        const updateData = { 
            name: 'Key lime pie', 
            ingredients: ['Sugar', 'Pie crust', 'key lime pie filling']
        };
        return chai.request(app)
        .get('/recipes')
        .then(function(res) {
            updateData.id = res.body[0].id;

            return chai.request(app)
            .put(`/recipes/${updateData.id}`)
            .send(updateData)
        })
        .then(function(res) {
            expect(res).to.have.status(204);
            
        });   
    });

    it('should delete recipes on delete', function() {
        return chai.request(app)
        .get('/recipes')
        .then(function(res) {
            return chai.request(app)
            .delete(`/recipes/${res.body[0].id}`);
        })
        .then(function(res) {
            expect(res).to.have.status(204);
        });
    });
});

