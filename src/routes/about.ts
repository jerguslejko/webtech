import * as express from 'express';

export default function (app: express.Express): void {
    app.get('/about', async (req, res) => {
        res.render('about', {
            boards: req.signedIn ? await req.signedIn.boards() : [],
        });
    });
}
