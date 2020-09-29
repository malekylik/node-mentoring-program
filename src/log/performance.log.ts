import express from 'express';

export function performanceLogDecorator<G>(
    controller: (req: express.Request, res: express.Response) => G | Promise<G>,
    contorllerName: string = controller.name
): (req: express.Request, res: express.Response) => void {
    return function decoratorController(req: express.Request, res: express.Response) {
        const now = Date.now();
        const date = new Date(now);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        console.log(`start: ${contorllerName} - ${hours}:${minutes}:${seconds}`);

        const result = controller(req, res);

        if ((result as Promise<G>).then) {
            void (result as Promise<G>).then(() => console.log(`end: ${contorllerName} - ${Date.now() - now}s`))
        } else {
            console.log(`end: ${contorllerName} - ${Date.now() - now}s`);
        }
    }
}
