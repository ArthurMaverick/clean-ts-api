import {Controller} from '@/presentation/protocols';
import {RequestHandler} from 'express';

type Adapter = (controller: Controller) => RequestHandler;

export const adaptRoute: Adapter = controller => async (request, response) => {
	const requestHandler = {
		...(request.body  || {}),
		...(request.query || {}),
		accountId: request.accountId
	};

	const {body, statusCode} = await controller.handle(requestHandler);
	const bodyOrError = statusCode >= 200 && statusCode <= 299
		? body
		: {error: body.message};

	response.status(statusCode).json(bodyOrError);
};
