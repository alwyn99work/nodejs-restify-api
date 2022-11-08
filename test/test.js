const request = require('supertest')
const server = require('../main')

describe('Sample Test', () => {
  it('should test that true === true', () => {
    expect(true).toBe(true)
  })
})

describe('Auth Endpoints', () => {
  it('should be login', async () => {
    const res = await request(server)
      .post('/auth')
      .send({
        username: 'root',
        password: 'password'
      })

    expect(res.statusCode).toEqual(200)
    expect(res.body.token).not.toBeNull();
  })
})

describe('Question Endpoints', () => {
  it('should create a new question', async () => {
    const auth = await request(server).post('/auth').send({ username: 'root', password: 'password' })

    const res = await request(server)
      .post('/questions')
      .set('Authorization', 'Bearer ' + auth.body.token)
      .send({
        question: 'Sedang apa ?',
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body.data[0].question).toEqual('Sedang apa ?')
  })

  it('should get questions', async () => {
    const auth = await request(server).post('/auth').send({ username: 'root', password: 'password' })

    const res = await request(server).get('/questions').set('Authorization', 'Bearer ' + auth.body.token)
    expect(res.statusCode).toEqual(200)
    expect(res.body.data).not.toBeNull()
    expect(res.body.data.length).toBeGreaterThan(0)
  })

  it('should update a question', async () => {
    const auth = await request(server).post('/auth').send({ username: 'root', password: 'password' })

    const get = await request(server).get('/questions').set('Authorization', 'Bearer ' + auth.body.token)
    expect(get.statusCode).toEqual(200)
    expect(get.body.data).not.toBeNull()
    expect(get.body.data.length).toBeGreaterThan(0)

    const id = get.body.data[0].id;
    const update = await request(server).put('/questions/' + id).set('Authorization', 'Bearer ' + auth.body.token)
      .send({
        question: 'Update question!'
      })
    expect(update.statusCode).toEqual(200)
    expect(update.body.data[0].question).toEqual('Update question!')
  })

  it('should delete a question', async () => {
    const auth = await request(server).post('/auth').send({ username: 'root', password: 'password' })

    const get = await request(server).get('/questions').set('Authorization', 'Bearer ' + auth.body.token)
    expect(get.statusCode).toEqual(200)
    expect(get.body.data).not.toBeNull();
    expect(get.body.data.length).toBeGreaterThan(0)

    const id = get.body.data[0].id;
    const del = await request(server).delete('/questions/' + id).set('Authorization', 'Bearer ' + auth.body.token);
    expect(del.statusCode).toEqual(200)
  })
})

describe('Answer Endpoints', () => {
  it('should create a new answer', async () => {
    const auth = await request(server).post('/auth').send({ username: 'root', password: 'password' })

    const res = await request(server)
      .post('/answers')
      .set('Authorization', 'Bearer ' + auth.body.token)
      .send({
        question_id: 1,
        answer: 'Sedang jalan jalan',
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body.data[0].question_id).toEqual(1)
    expect(res.body.data[0].answer).toEqual('Sedang jalan jalan')
  })

  it('should get answers', async () => {
    const auth = await request(server).post('/auth').send({ username: 'root', password: 'password' })

    const res = await request(server).get('/answers').set('Authorization', 'Bearer ' + auth.body.token)
    expect(res.statusCode).toEqual(200)
    expect(res.body.data).not.toBeNull();
    expect(res.body.data.length).toBeGreaterThan(0)
  })

  it('should update a answer', async () => {
    const auth = await request(server).post('/auth').send({ username: 'root', password: 'password' })

    const get = await request(server).get('/answers').set('Authorization', 'Bearer ' + auth.body.token)
    expect(get.statusCode).toEqual(200)
    expect(get.body.data).not.toBeNull();
    expect(get.body.data.length).toBeGreaterThan(0)

    const id = get.body.data[0].id;
    const update = await request(server).put('/answers/' + id).set('Authorization', 'Bearer ' + auth.body.token)
      .send({
        answer: 'Update answer!'
      })
    expect(update.statusCode).toEqual(200)
    expect(update.body.data[0].answer).toEqual('Update answer!')
  })

  it('should delete a answer', async () => {
    const auth = await request(server).post('/auth').send({ username: 'root', password: 'password' })

    const get = await request(server).get('/answers').set('Authorization', 'Bearer ' + auth.body.token)
    expect(get.statusCode).toEqual(200)
    expect(get.body.data).not.toBeNull();
    expect(get.body.data.length).toBeGreaterThan(0)

    const id = get.body.data[0].id;
    const del = await request(server).delete('/answers/' + id).set('Authorization', 'Bearer ' + auth.body.token);
    expect(del.statusCode).toEqual(200)
  })
})