const express = require("express");
const path = require("path");
const db=require("./db/conn");

const User=require("./models/user");
const Users=require("./models/usermessage");

const bcrypt = require("bcryptjs");

const hbs = require("hbs");
const { registerPartials } = require("hbs")

const app = express();
const port = process.env.PORT || 3000;

//setting the path
const staticpath=path.join(__dirname, "../public");
const templatepath=path.join(__dirname, "../templates/views");
const partialpath=path.join(__dirname, "../templates/partials");

//middleware
app.use(function(req, res, next) {
    res.header("X-Content-Type-Options", "nosniff");
    next();
});

app.use((req, res, next) => {
    if (req.url.endsWith('.js')) {
        res.setHeader('Content-Type', 'text/javascript');
    }
    next();
});

app.use('/css',express.static(path.join(__dirname,"../nodemodules/bootstrap/dist/css")));
app.use('/js',express.static(path.join(__dirname,"../nodemodules/bootstrap/dist/js")));
app.use('/jq',express.static(path.join(__dirname,"../nodemodules/jquery")));

app.use(express.urlencoded({extended:false}))
app.use(express.static(staticpath))
app.set("view engine","hbs");
app.set("views",templatepath);
hbs.registerPartials(partialpath);


const session = require("express-session");
const user = require("./models/user");


app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 3600000 } // 1 hour
}));

//routing
//app.get(path,callback)
app.get("/",(req,res)=>{
    res.render("index");
})

app.get("/contact",(req,res)=>{
    res.render("contact");
}) 

app.post("/contact", async(req,res) => {
    try {
        //res.send(req.body);
        console.log("the req body is --> ",req.body);
        // res.send(req.body);
        const userData = await User.create({
            name:req.body.name,
            email:req.body.email,
            number:req.body.number,
            Event:req.body.event,
            message:req.body.message
        });
        console.log("the user that got from contact is --> ",userData);
        console.log(userData);
        // await userData.save();
        res.status(201).render("index");
    } catch (error) {
        console.log("the error is --> ",error);
        res.status(400).send(error);
    }
})

// Registration page
app.get('/signin', (req, res) => {
    res.render('signin', { layout: false }); // rendering without a layout
});


// Handling user signup
app.post("/signin", async (req, res) => {
    // console.log("the req whole is --> ",req);
    console.log("the req is --> ",req.body);
    try {
        const {email, password} = req.body;
        // const user = new Users({ name, email, password, number, event, message });
        // const registered = await user.save();
        const user=await Users.create({email, password});
        console.log("the user is --> ",user);
        //console.log("the regsitered user is --> ",registered);//
        res.status(201).redirect("/");
    } catch (error) {
        res.status(500).send(error);
    }
});

// Login page
// Route for the Login page
app.get('/login', (req, res) => {
    res.render('login', { layout: false }); // rendering without a layout
});


// Handling user login
app.post("/login", async (req, res) => {
    console.log("the req body of login is --> ",req.body);
    try {
        const { email, password } = req.body;
        const user = await Users.findOne({ email });
        console.log("the user found is --> ",user);
        if (user) {
            console.log("i am inside of if");
            let isMatch=await bcrypt.compare(password, user.password);
            console.log("the result of compare -->",isMatch);
            if (isMatch) {
                console.log("i am inside of isMatch if ");
                req.session.user = user;
                return res.status(200).redirect("/");
            } else {
                return res.status(400).send("Invalid Credentials");
            }
        } else {
            return res.status(400).send("User not found");
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

const requireLogin = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    next();
};

// Use this middleware in routes that require authentication
app.get("/index", requireLogin, (req, res) => {
    res.render("index");        
});


//server create
app.listen(port,()=>{
    console.log('serving is running at port no ${port}');
})