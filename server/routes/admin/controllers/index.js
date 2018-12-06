const express = require('express');
const to = require('await-to-js').default;

const Models = require('@models');

// Контроллеры на экспорт.
module.exports = {

// Создание объекта работы
createJob: async (req, res, next) => {
    const job = Models.Job(req.body);

    const [err] = await to(
        job.save()
    );
    if (err) {
        req.log.error('Job could not be created');
        return next(err);
    }

    req.log.info({
        log_info: {
            job
        }
    }, 'Job successfuly created');
    return res.status(200).json({
        job
    });
},

// Создание инфо о слайде
createSlideInfo: async (req, res, next) => {
    const slide = Models.SlideInfo(req.body);

    const [err] = await to(
        slide.save()
    );
    if (err) {
        req.log.error('Slide info could not be created');
        return next(err);
    }

    req.log.info({
        log_info: {
            slide
        }
    }, 'Slide info successfuly created');
    return res.status(200).json({
        slide
    });
},

};
