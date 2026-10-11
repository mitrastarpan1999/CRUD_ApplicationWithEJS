const { error } = require("console");
const user = require("../models/user.model");
const fs = require("fs");
const path = require("path");
const cloudinary = require("cloudinary").v2;
class userController {
  async createUser(req, res) {
    console.log(req.file);

    try {
      const { name, position, age, email, description } = req.body;
      // console.log(req.body);

      if (!name || !position || !age || !email) {
        if (req.file) {
          await cloudinary.uploader.destroy(req.file.filename);
        }
        return res.render("CRUD/create", {
          error: "All fields are required",
          title: "Create page",
        });
      }

      const userData = new user({
        name,
        position,
        age,
        email,
        description,
      });

      if (req.file) {
        userData.image = req.file.path;
        userData.publicImageID = req.file.filename;
      }

      const savedUser = await userData.save();

      if (savedUser) {
        return res.redirect("/list");
      }
    } catch (error) {
      if (req.file) {
        await cloudinary.uploader.destroy(req.file.filename);
      }
      return res.render("CRUD/create", {
        error: error.message,
        title: "Create page",
      });
    }
  }

  async list(req, res) {
    const search = req.query.search;
    // console.log(search);
    const query = { isDeleted: false };
    const { roles } = req.query;

    console.log("role: ", roles);

    if (roles && roles !== "all") {
      if (roles === "others") {
        query.position = {
          $not: {
            $regex: "developer|designer|writer",
            $options: "i",
          },
        };
      } else {
        query.position = {
          $regex: roles,
          $options: "i",
        };
      }
    }

    if (search) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          email: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    console.log(query);

    const users = await user.find(query);

    // console.log("USERS:", users);

    return res.render("CRUD/list", {
      title: "list Page",
      data: users,
      roles: roles,
    });
  }

  async create(req, res) {
    return res.render("CRUD/create", {
      title: "Create User",
      error: "",
    });
  }

  async edit(req, res) {
    const id = req.params.id;
    const findUser = await user.findById(id);
    if (!findUser) {
      return res.redirect("/list", {
        error: "Sorry something went wrong",
      });
    }

    return res.render("CRUD/edit", {
      title: "Edit page",
      data: findUser,
      error: "",
    });
  }

  async updatePage(req, res) {
    try {
      const id = req.params.id;
      const findUser = await user.findById(id);
      if (!findUser) {
        if (req.file) {
          const publicImageID = req.file.filename;
          if (publicImageID) {
            await cloudinary.uploader.destroy(publicImageID);
          }
        }
        return res.redirect("/list")
      }
      console.log("sdfsfs", findUser.image);

      if (req.file && findUser.publicImageID) {
        await cloudinary.uploader.destroy(findUser.publicImageID);
      }

      const { name, position, age, email, description } = req.body;

      const updateData = {
        name,
        position,
        age,
        email,
        description,
      };

      if (req.file) {
        updateData.image = req.file.path;
        updateData.publicImageID = req.file.filename
      }

      console.log(req.file);

      const finalUpdate = await user.findByIdAndUpdate(id, updateData, {
        new: true,
      });
      console.log("Final Update: ", finalUpdate);

      return res.redirect("/list");
    } catch (error) {
      const id = req.params.id;
      const findUser = await user.findById(id);
      if (req.file) {
        await cloudinary.uploader.destroy(req.file.filename)
        console.log(error);

        return res.render("CRUD/edit", {
          title: "Edit page",
          data: findUser,
          error: "Something is wrong",
        });
      }
    }
  }

  async recycleBin(req, res) {
    try {
      const id = req.params.id;
      const update = await user.findByIdAndUpdate(
        id,
        { isDeleted: true },
        { new: true },
      );
      return res.redirect("/list");
    } catch (error) {
      console.log(error);
    }
  }

  async recycleBinPage(req, res) {
    try {
      const findUser = await user.find({ isDeleted: true });
      console.log(findUser);

      return res.render("CRUD/recycle", {
        title: "Recycle page",
        data: findUser,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async restore(req, res) {
    try {
      const id = req.params.id;
      const update = await user.findByIdAndUpdate(
        id,
        { isDeleted: false },
        { new: true },
      );
      console.log("update", update);

      return res.redirect("/list");
    } catch (error) {
      console.log(error);
    }
  }

  async hardDelete(req, res) {
    try {
      const id = req.params.id;
      const findUser = await user.findById(id);
      if (!findUser) {
        return res.redirect("/list");
      }

      if (findUser.publicImageID) {
        // const filePath = path.join(__dirname, "../../", findUser.image);
        // if (filePath) {
        //   await fs.promises.rm(filePath);
        // }

        await cloudinary.uploader.destroy(findUser.publicImageID);
      }
      await user.findByIdAndDelete(id);

      return res.redirect("/list");
    } catch (error) {
      console.log(error);
    }
  }

  // async view(req, res){

  //   try {

  //     const id = req.params.id;
  //     const findUser = await user.findById(id)
  //     return res.render('/list', {

  //       viewData: findUser
  //     })

  //   } catch(error) {

  //   }
  // }
}

module.exports = new userController();
