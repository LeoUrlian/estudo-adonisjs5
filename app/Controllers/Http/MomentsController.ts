import Application from '@ioc:Adonis/Core/Application'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Moment from 'App/Models/Moment'

import { v4 as uuidv4 } from 'uuid'

export default class MomentsController {
  private validationOptions = {
    types: ['image'],
    size: '2mb',
  }

  public async store({ request, response }: HttpContextContract) {
    const body = request.body()

    const image = request.file('image', this.validationOptions)
    if (image) {
      const imageName = `${uuidv4()}.${image.extname}`

      await image.move(Application.tmpPath('uploads'), {
        name: imageName,
      })

      body.image = imageName
    }

    const moment = await Moment.create(body)
    return response.status(200).send({ message: 'Momento criado com sucesso!', data: moment })
  }

  public async index({ response }: HttpContextContract) {
    const moments = await Moment.query().preload('comments')
    return response.status(200).send({ data: moments })
  }

  public async show({ params, response }: HttpContextContract) {
    const moment = await Moment.findOrFail(params.id)

    await moment.load('comments')
    return response.status(200).send({ data: moment })
  }

  public async destroy({ params, response }: HttpContextContract) {
    const moment = await Moment.findOrFail(params.id)

    await moment.delete()
    return response.status(200).send({ message: 'Moment deletado com sucesso!', data: moment })
  }

  public async update({ params, response, request }: HttpContextContract) {
    const body = request.body()

    const moment = await Moment.findOrFail(params.id)

    moment.title = body.title
    moment.description = body.description

    if (moment.image !== body.image || !moment.image) {
      const image = request.file('image', this.validationOptions)
      if (image) {
        const imageName = `${uuidv4()}.${image.extname}`

        await image.move(Application.tmpPath('uploads'), {
          name: imageName,
        })

        body.image = imageName
      }
    }
    await moment.save()
    return response.status(200).send({ message: 'Moment atualizado com sucesso!', data: moment })
  }
}
