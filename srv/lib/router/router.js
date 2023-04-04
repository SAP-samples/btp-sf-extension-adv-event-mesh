import express from "express";
import Storage from "../database/storage.js";
import NotImplementedError from '../error/not-implemented-error.js'
import { validate } from "uuid";
export default (storage, logger) => {

    const router = express.Router()

    router.get("/Notifications", async (req, res, next) => {
        try {
            // Make request to storage
            const results = await Storage.readAll(req.db, logger)
            res.status(200).json({ Notifications: results })

        } catch (error) {
            next(error)
        }
    })

    router.patch("/Notifications/:id", async (_, res) => {
        // throw new NotImplementedError("Patch not implemented")
        res.send(501)
    })
    router.post("/Notifications/:id", async (_, res) => {
        res.send(501)
    })

    router.post("/Notifications/:id/workstation", express.json(), async (req, res) => {
        const EXTERNALID = req.params.id
        console.log(req.body)
        if (!validate(EXTERNALID)) {
            res.sendStatus(400)
            return
        }
        await Storage.update(logger, req.db, { ...req.body, EXTERNALID })

        res.sendStatus(204)
    })
    return router
}
