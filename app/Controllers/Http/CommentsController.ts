import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Comment from 'App/Models/Comment'

export default class CommentsController {
  public async store({ response, request, params }: HttpContextContract) {
    const body = request.body()
    const momentId = params.momentId

    body.momentId = momentId

    const comment = await Comment.create(body)
    response.status(200).send({ message: 'Comentário adicionado com sucesso!', data: comment })
  }
}
