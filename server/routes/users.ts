import { Router, context } from "@oak/oak";
import { DatabaseSync } from "node:sqlite";
import { authMiddleware, AuthContext } from "../middlewares/authMiddleware";
import {
  APIException,
  ApiErrorCode,
  ApiResponse,
} from "../types/exceptionType";
import { hashPassword } from "../lib/jwt.ts";
import { User } from "../types/authentification";
import { isUserRow } from "../types/userType";
import { userRowToApi } from "../mappers/mappers.ts";

const db = new DatabaseSync("polls.db");

const router = new Router({ prefix: "/users" });

// Enregistrement d'un nouvel utilisateur
router.post("/register", async (ctx: context) => {
  try {
    const name = ctx.params.name;
    const lastName = ctx.params.lastname;
    const hashedPassword = await hashPassword(ctx.params.password);
    const email = ctx.params.email;

    if (!name || !lastName || !hashedPassword || !email) {
      throw new APIException(
        ApiErrorCode.UNAUTHORIZED,
        404,
        "Missing information(s)..."
      );
    }

    const insertResult = db
      .prepare(
        "INSERT INTO users (name, last_name, password, email, role) VALUES (:name, :lastName, :password, :email, :role)"
      )
      .run({
        name: name,
        lastName: lastName,
        password: hashedPassword,
        email: email,
        role: "utilisateur",
      });

    if (!insertResult || insertResult.changes === 0) {
      const response: ApiResponse<User> = {
        success: false,
        error: {
          code: ApiErrorCode.BAD_REQUEST,
          message: "error in the request.",
        },
      };

      ctx.response.status = 404;
      ctx.response.body = response;

      return;
    }

    const newId = insertResult.lastInsertRowid;

    const userRow = db
      .prepare(
        "SELECT user_id, name, last_name, password, email, role FROM users WHERE user_id = ?;"
      )
      .get(newId);

    if (!userRow || !isUserRow(userRow)) {
      const response: ApiResponse<User> = {
        success: false,
        error: {
          code: ApiErrorCode.BAD_REQUEST,
          message: "error in the request.",
        },
      };

      ctx.response.status = 404;
      ctx.response.body = response;

      return;
    }

    const response: ApiResponse<User> = {
      success: true,
      data: userRowToApi(userRow),
    };

    ctx.response.status = 200;
    ctx.response.body = response;
  } catch (err: any) {
    console.error("Erreur SQL détaillée :", err.message);
    ctx.response.status = 500;
    ctx.response.body = { success: false, error: { message: err.message } };
  }
});

// Connexion utilisateur
router.post("/login", async (ctx: context) => {
  // À compléter...
});

// Retourne les informations stockées en BDD pour l'utilisateur connecté
// (Liste des sondages créés, nombre de votes, etc.)
// Les requêtes passent par le middleware d'authentification !
router.get("/me", authMiddleware, (ctx: AuthContext) => {
  // À compléter...
});
