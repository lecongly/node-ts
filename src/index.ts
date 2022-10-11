import 'dotenv/config';
import 'module-alias/register';
import App from './app';
import PostController from '@/resources/post/post.controller';
import UserController from '@/resources/user/user.controller';
import UploadController from '@/resources/image/image.controller';
import { config } from '@/utils/config';

const app = new App(
    [new PostController(), new UserController(), new UploadController()],
    Number(config.port)
);
app.listen();
