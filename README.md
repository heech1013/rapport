# Rapport

_Rapport_ is psychotherapist matching service.  
3 team member: Iksun Heo(marketing), Hyeonwoo Jeong(front-end), Heechang Shin(back-end, me) had struggling 2 years: Jan. 2018 - Nov.2019.

## 🔫 Purpose

Purposes of this project are as follows.

- Help people to find certificated psychotherapist - suitable for own's problem.
- Connect customer and psychotherapist without time & spatial constraints.

## ☕ Skills

Node.js, MySQL, AWS(EC2, RDS, S3, CloudFront, Route53)

## 👀 Summary

This project is back-end part of the service _Rapport_. It contains following features through API.

- Let the customers search psychotherapists, reserve counseling, manage schedule.
- Let the psychotherapists manage their profile & operating hours & available regions & reservations.

## 🏄🏻‍♂️ Surfing a service

**Main page**

![README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled.png](README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled.png)

![README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled%214.png](README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled%2014.png)

In the main page, we appeal to people the advantages of _Rapport_ : professionalism, trust, convenience.

**Psychotherapist search page**

![README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/__.jpg](README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/__.jpg)

People can search certificated psychotherapists based on the filter : specialties & available regions and date.

**Psychotherapist profile page**

![README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled%203.png](README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled%203.png)

People can check psychotherapists' detailed profile: introduction & specialties & careers & price & available regions & opening hours.

Also, people can reserve counseling in ease, by submitting simple application form.

**My page for psychotherapist**
![README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled%204.png](README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled%204.png)

Psychotherapists can update their profile, including uploading pictures and certification files.

![README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled%205.png](README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled%205.png)

Psychotherapist can manage their opening hours with fixed, recurring based.

And they can select available regions where they would be matched later.

![README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled%206.png](README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled%206.png)

As exception of fixed-recurring schedules, psychotherapists can set day off respectively.

![README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled%207.png](README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled%207.png)

Psychotherapists can manage counseling reservation. Also, they can check customer's counseling application.

Customers can check their reserved counseling schedule on their 'my page' either.

## 💻 Detailed implementation

I, as a team member who took care of back-end, implemented a server and database, and deployed the service. Another team member who cared front-end, built client side with React(it is located at another repository).

**Architecture**

![README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled%208.png](README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled%208.png)

- By using RDS, I could get benefits in easy database administration, snapshot(back-up) service, securing. It could be better to build database in EC2 if I need a more flexibility.
- Usage of CloudFront was explicitly over-spec, in the sense that the _Rapport_ was a service very localized in South Korea. But as free tier account, it could be just one of interesting options. And one more thing - with CloudFront, we can construct HTTPS easily.

**Web framework**

It uses Express for a Node.js web framework.

**Database schema**

![README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled%209.png](README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled%209.png)

Schema `USERS` stores all types of user, including `'client'`, `'counselor'`(= psychotherapist), `'manager'`. Logic distinguish user types by attribute `userType`.

Schema `OPENS` is used for storing psychotherapist's open hours. It doesn't look much elegant. It stores every weekday from `MON` to `SUN`, hours from 00:00(`0`) to 23:00(`23`) as each attributes. But after some consideration, I thought this construction would be good for the following reasons.

- Easy management: It is easy to change an open hours of psychotherapist in business logic, compared to find & check & modify & delete each rows representing each psychotherapist's `startTime` | `endTime` | `weekDay`.
- Low capacity cost: It can maintain 1 row per 1 psychotherapist.
- Suitable form for user: Psychotherapists tend to manage open hours by frequent empty in places(a lot of blocks - rows), not by continuous time ranges(few blocks - rows).
- Suitable for reservation logic: Open hours' on-time blocks are consistent with reservations' on-time based data.

**Authentication**

It uses passport as authentication middleware for Node.js + JWT. After authenticating user by localStrategy of passport, the server generates JWT token with user's info.

```jsx
/* local.js
 : check user's authority with localStrategy */
module.exports = passport => {
	passport.use(new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
	}, async (req, email, password, done) => {
		// ...
		return done(null, user);
	});
}

/* login.js
 : generate jwt token with authenticated user info. */
passport.authenticate('local', { session: false }, (authError, user, info) => {
	// ...
	return req.login(user, { session: false }, loginError => {
		// ...
		const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '12h' });

		return res.status(200).json({ success: true, token });
	});
})(req, res, next);

/* jwt.js
 : check jwt token sent in request's Authorization header as Bearer token */
module.exports = passport => {
	passport.use(new JWTStrategy(
		{
			jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.JWT_SECRET,
		},
		// ...
		return done(null, jwtPayload);
	));
}
```

Using JWT gives the following advantages.

- Security: JWT guarantees integrity & validity by signature.
- Scalability: Client and server are independent.
- Less momory to maintain data about users compared to session.

On the other hand, there are some cons.

- More traffic: Token is attached in almost every requests, leading more traffic.
- Token hijacking: Stolen token could be abused by someone.

**ORM**

It uses Sequelize.js for Node.js based ORM which supports MySQL.

**API architecture**

It is designed while following REST API architecture.

- URI represents resource of data.  
  `GET /client/reservation/:id`
- Behavior on resources is represented by HTTP method.  
  `PUT /counselor/profile/:id`
- It responses with status code along with its proper meaning.  
  `400 on client's inappropriate request`  
  `401 on unauthorized access`  
  `500 on internal server error`

However, according to strict constraints of REST prescribed by Roy Fielding, it doesn't follow the rule "_uniform interface_". Other rules are automatically followed because API are built on HTTP protocol.

Among components of _uniform interface_, it doesn't obey the following points.

- Self-descriptive messages
- Hypermedia As The Engine Of Application State (HATEOAS)

In the sense, maybe I sholud call it just "HTTP API".

**Business logic**

If you look around business logic, especially about handling date & time, you can have a little taste of my efforts..! 🤧

`rapport_web_service/Rapport_backend/routes/client/reservation/...`  
`rapport_web_service/Rapport_backend/middlewares/etcFunc/...`  
`...`

![README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled%2010.png](README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled%2010.png)

## 🌈 etc.

**Documentation**

After having inconvenient points on communicating with team member who cared front-end, I made our own documentation. And I make some rules about using documents and managed to maintain them clean & well-organized.

🔀 Product flow chart: helped team members to understand the flow of service.

![README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled%2011.png](README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled%2011.png)

📑 REST API docs: benefits on fast & convenient catching on requirements despite every day of chages.

![README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled%2012.png](README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled%2012.png)

🤼‍♂️ Development cooperation log: reduction on unneccesary communication, good for organized work flow management.

![README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled%2013.png](README%20md%20-%20Rapport%20817db67b8ea7405d8f8c5c400abd69f9/Untitled%2013.png)

**Web design**

I designed every pages & components in _Rapport_, including mobile version.

**Partial success**

- $35,000 fund supported from _2019_ _Preliminary Start-up Package_ (organized by _Korea Institute of Start-up and Entrepreneurship Development_).
- 12 psychotherapists(certificated at _Korea Psychological Association_) registered and used our service.

And some prizes-

- Excellence award at _2018 Namyangju Hackathon_ (organized by _Namyangju-si, Korea)._
- Excellence start-up club at _2018 Start-up Club Selection_ (organized by _Chung-Ang University)._
- Silver award at _2018 Davinci Software Camp_ (organized by _Chung-Ang University)._
- Final 300 team on _2018 K-STARTUP University Start-up Team 300_ (organized by _Ministry of Science and Technology Information and Communication of Korea)._

**Unsatisfactory parts**

In the end, we concluded to quit this project because we had trouble getting users and profits.

## 📜 License

_Rapport_ is under the MIT license.
