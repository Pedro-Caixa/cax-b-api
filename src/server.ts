import { app } from './app';

const port = process.env.PORT || 12121

const server = app.listen(port, () =>  console.log(`Listening on port ${port}\nhttp://localhost:${port}`))

process.on('SIGINT', () => {
    server.close();
    console.log(`Application was interrupted`);
});
