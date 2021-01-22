// import * as Yup from 'yup';
import User from '../models/User';

class UserController {
  async store(req, res) {
    // const schema = Yup.object().shape({
    //   name: Yup.string().required,
    //   email: Yup.string().email().required,
    //   password: Yup.string().required().min(6),
    // });

    // if (!(await schema.isValid(req.body))) {
    //   return res.status(400).json({ error: 'Validade fails' });
    // };

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'Usuário já existe!' });
    }

    const { id, name, email, provider } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }

  async update(req, res) {
    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    const { email: userEmail } = user.dataValues;

    console.log(email);
    console.log(userEmail);

    if (email !== userEmail) {
      const userExists = await User.findByPk(req.userId);
      // console.log(userExists);
      if (userExists) {
        return res.status(400).json({ error: 'Usuário já existe!' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name, provider } = User.update(req.body);

    return res.json({
      id,
      name,
      email,
      provider,
    });
  }
}

export default new UserController();
