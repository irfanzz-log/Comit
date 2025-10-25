import nodemailer from 'nodemailer';

export async function POST(req) {
    const {name,email,message} = await req.json();

    try {
        const transporter = nodemailer.createTransport({
            service : 'gmail',
            auth : {
                user : process.env,
                pass : process.env,
            },
        });

        await transporter.sendMail({
            from : `"${name}" <${email}>`,
            to : process.env,
            subject : `Pesan dari ${name}`,
            text : message,
        });

        return Response.json({succes : true});
    }

    catch (err) {
        console.log(err);
        return Response.json({succes: false, error: err.message}, { status: 500 });
    }
}