
import { test } from "../fixtures";
import { expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import LoginPage from "../poms/login";
import { createCommentAndVerify } from "../utils/tasks";
import { TaskPage } from "../poms/tasks";

test.describe("Task comments", () => {
    let taskName: string;
    let comment: string;

    test.beforeEach(() => {
        taskName = faker.word.words({ count: 5 });
        comment = faker.word.words({ count: 30 });
    });

    test("should add a new comment as a creator of task", async ({ page, taskPage, browser }) => {
        await page.goto("/");
        await taskPage.createTaskAndVerify({ taskName, userName: "Sam Smith" });
        await taskPage.addCommentAndVerify({ page, taskName, comment });

        await test.step("Verify comment is persisted as the assignee", async () => {
            const newUserContext = await browser.newContext({
                storageState: { cookies: [], origins: [] },
            });

            const newUserPage = await newUserContext.newPage();
            const loginPage = new LoginPage(newUserPage);

            await newUserPage.goto("/");
            await loginPage.loginAndVerifyUser({
                email: "sam@example.com",
                password: "welcome",
                username: "Sam Smith",
            });

            await taskPage.verfiyCommentPersisted({ newUserPage, taskName, comment })
            await newUserPage.close();
            await newUserContext.close();
        })
    })

    test("should add a new comment as an assignee of a task", async ({ page, taskPage, browser }) => {
        await page.goto("/");
        await taskPage.createTaskAndVerify({ taskName, userName: "Sam Smith" });

        await test.step("Add comment as assignee", async () => {
            const newUserContext = await browser.newContext({
                storageState: { cookies: [], origins: [] },
            });
            const newUserPage = await newUserContext.newPage();
            const loginPage = new LoginPage(newUserPage);
            const newTaskPage = new TaskPage(newUserPage);

            await newUserPage.goto("/");
            await loginPage.loginAndVerifyUser({
                email: "sam@example.com",
                password: "welcome",
                username: "Sam Smith",
            });
            await newTaskPage.addCommentAndVerify({ taskName, comment });
            await newUserPage.close();
            await newUserContext.close();
        })

        await test.step("Verify comment is persisted as the creator", async () => {
            await page.reload();
            await taskPage.verfiyCommentPersisted({ page, taskName, comment })
        })
    })
})