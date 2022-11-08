"use strict";

const config = require('./config');
const restify = require('restify');
const rjwt = require('restify-jwt-community');
const jwt = require('jsonwebtoken');
const corsMiddleware = require('restify-cors-middleware')

const cors = corsMiddleware({
    preflightMaxAge: 5, //Optional
    origins: ['*'],
    allowHeaders: ['*'],
    exposeHeaders: ['*']
})

const connection = config.db.get;

function query(type, sql, reqs, res, next, options = null) {
    connection.query(sql, reqs ? [...reqs] : [], function (error, results) {
        if (error) {
            res.send({
                code: 500,
                status: 'error',
                message: error
            });
        }

        if (options) {
            if (!options?.id) {
                connection.query(options?.sql, [results.insertId], function (error, results) {
                    if (options?.msg) {
                        res.send({
                            code: 200,
                            status: 'success',
                            message: options?.msg
                        });
                    }

                    if (results.length > 0) {
                        res.send({
                            code: 200,
                            status: 'success',
                            data: mapResult(type, results)
                        });
                    } else {
                        res.status(404);
                        res.send({
                            code: 404,
                            status: 'failed',
                            data: 'Not found'
                        });
                    }

                });
            }

            if (options?.id) {
                connection.query(options?.sql, [options?.id], function (error, results) {
                    if (options?.msg) {
                        res.send({
                            code: 200,
                            status: 'success',
                            message: options?.msg
                        });
                    }
                    
                    if (results.length > 0) {
                        res.send({
                            code: 200,
                            status: 'success',
                            data: mapResult(type, results)
                        });
                    } else {
                        res.status(404);
                        res.send({
                            code: 404,
                            status: 'failed',
                            data: 'Not found'
                        });
                    }
                });
            }

        } else {
            res.send({
                code: 200,
                status: 'success',
                data: mapResult(type, results)
            });
        }
    });

    return next();
}

function mapResult(type, results) {
    return results.map((item) => {
        if (type == 'questions') {
            return {
                id: item.id,
                question: item.question,
                created_at: item.created_at
            }
        }
        if (type == 'answers') {
            return {
                id: item.id,
                question_id: item.question_id,
                answer: item.answer,
                created_at: item.created_at
            }
        }
    })
}

/**
 * Initialize Server
 */
const server = restify.createServer({
    name: config.name,
    version: config.version,
    url: config.hostname
});

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.pre(cors.preflight)
server.use(cors.actual)

server.use(rjwt(config.jwt).unless({ path: ['/auth'] }));

server.post({
    url: '/auth',
    queries: {
        username: { isRequired: true },
        password: { isRequired: true }
    }
}, (req, res, next) => {
    const reqs = [req.body.username, req.body.password];
    const sql = 'SELECT * FROM users WHERE username=? AND password=?';
    connection.query(sql, [...reqs], function (error, results) {
        if (results.length > 0) {
            console.info(results == true);
            let token = jwt.sign({
                id: results.id,
                username: results.username,
                password: results.password
            }, config.jwt.secret, {
                expiresIn: '60m' // token expires in x minutes
            });

            // retrieve issue and expiration times
            let { iat, exp } = jwt.decode(token);
            res.send({ iat, exp, token });
        } else {
            res.status(404);
            res.send({
                code: 404,
                status: 'error',
                message: 'User not found!'
            });
        }
    });
});

server.get('/questions', function (req, res, next) {
    console.info('GET /questions');
    const sql = 'SELECT * FROM questions';
    query('questions', sql, null, res, next);
});

server.get('/questions/:id', function (req, res, next) {
    console.info('GET /questions/:id');
    const sql = 'SELECT * FROM questions WHERE id=?';
    const reqs = [req.params.id];
    query('questions', sql, reqs, res, next);
});

server.post('/questions', function (req, res, next) {
    console.info('POST /questions');
    const sql = 'INSERT INTO questions (question) VALUES (?)';
    const reqs = [req.body.question];
    const fetchSql = 'SELECT * FROM questions WHERE id=?';
    query('questions', sql, reqs, res, next, { sql: fetchSql });
});

server.put('/questions/:id', function (req, res, next) {
    console.info('PUT /questions/:id');
    const sql = 'UPDATE questions SET question=? WHERE id=?';
    const reqs = [req.body.question, req.params.id];
    const findSql = 'SELECT * FROM questions WHERE id=?';
    query('questions', sql, reqs, res, next, { id: req.params.id, sql: findSql });
});

server.del('/questions/:id', function (req, res, next) {
    console.info('DELETE /questions/:id');
    const sql = 'DELETE FROM questions WHERE id=?';
    const msg = 'Record has been deleted!';
    connection.query(sql, [req.params.id], function (error, results, fields) {
        if (error) throw error;
        res.send({
            code: 200,
            status: 'success',
            message: msg
        });
    });
});

server.get('/answers', function (req, res, next) {
    console.info('GET /answers');
    const sql = 'SELECT * FROM answers';
    query('answers', sql, null, res, next);
});

server.get('/answers/:id', function (req, res, next) {
    console.info('GET /answers/:id');
    const sql = 'SELECT * FROM answers WHERE id=?';
    const reqs = [req.params.id];
    query('answers', sql, reqs, res, next);
});

server.post('/answers', function (req, res, next) {
    console.info('POST /answers');
    const sql = 'INSERT INTO answers (question_id,answer) VALUES (?,?)';
    const reqs = [req.body.question_id, req.body.answer];
    const fetchSql = 'SELECT * FROM answers WHERE id=?';
    query('answers', sql, reqs, res, next, { sql: fetchSql });
});

server.put('/answers/:id', function (req, res, next) {
    console.info('PUT /answers/:id');
    const sql = 'UPDATE answers SET answer=? WHERE id=?';
    const reqs = [req.body.answer, req.params.id];
    const findSql = 'SELECT * FROM answers WHERE id=?';
    query('answers', sql, reqs, res, next, { id: req.params.id, sql: findSql });
});

server.del('/answers/:id', function (req, res, next) {
    console.info('DELETE /answers/:id');
    const sql = 'DELETE FROM answers WHERE id=?';
    const msg = 'Record has been deleted!';
    connection.query(sql, [req.params.id], function (error, results, fields) {
        if (error) throw error;
        res.send({
            code: 200,
            status: 'success',
            message: msg
        });
    });
});

server.listen(config.port, function () {
    console.log('%s listening at %s', server.name, server.url);
});

module.exports = server