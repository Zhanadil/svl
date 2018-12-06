const express = require('express');
const to = require('await-to-js').default;

const Models = require('@models');

// Контроллеры на экспорт.
module.exports = {

// Создание объекта работы
getAllOccupations: async (req, res, next) => {
    const pipeline = [
        {
            "$group": {
                "_id": "$occupation",
                "count": { "$sum": 1 }
            }
        }
    ];

    const [err, results] = await to(
        Models.Job.aggregate(pipeline)
    );

    return res.status(200).json(results);
},

// Возвращаем инфо о слайде
getSlideInfo: async (req, res, next) => {
    const [err, slides] = await to(
        Models.SlideInfo.find({
            page: req.params.page
        })
    );

    return res.status(200).json(slides);
},

};
