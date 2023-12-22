// poms/tasks.ts

import { Page, expect } from "@playwright/test";

interface TaskName {
  taskName: string;
}

interface TaskCommentProps extends TaskName {
  comment: string;
}

interface CreateNewTaskProps extends TaskName {
  userName?: string;
}

export class TaskPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  createTaskAndVerify = async ({
    taskName,
    userName = "Oliver Smith",
  }: CreateNewTaskProps) => {
    await this.page.getByTestId("navbar-add-todo-link").click();
    await this.page.getByTestId("form-title-field").fill(taskName);

    await this.page.locator(".css-2b097c-container").click();
    await this.page.locator(".css-26l3qy-menu").getByText(userName).click();
    await this.page.getByTestId("form-submit-button").click();
    const taskInDashboard = this.page
      .getByTestId("tasks-pending-table")
      .getByRole('row', { name: taskName })
    await taskInDashboard.scrollIntoViewIfNeeded();
    await expect(taskInDashboard).toBeVisible();
  };

  markTaskAsCompletedAndVerify = async ({ taskName }: TaskName) => {
    await this.page
      .getByTestId("tasks-pending-table")
      .getByRole("row", { name: taskName })
      .getByRole("checkbox")
      .click();
    const completedTaskInDashboard = this.page
      .getByTestId("tasks-completed-table")
      .getByRole("row", { name: taskName });
    await completedTaskInDashboard.scrollIntoViewIfNeeded();
    await expect(completedTaskInDashboard).toBeVisible();
  };

  starTaskAndVerify = async ({ taskName }: TaskName) => {
    const starIcon = this.page
      .getByTestId("tasks-pending-table")
      .getByRole("row", { name: taskName })
      .getByTestId("pending-task-star-or-unstar-link");
    await starIcon.click();
    await expect(starIcon).toHaveClass(/ri-star-fill/i);
    await expect(
      this.page.getByTestId("tasks-pending-table").getByRole("row").nth(1)
    ).toContainText(taskName);
  };

  addCommentAndVerify = async ({ taskName, comment }: TaskCommentProps) => {
    await this.page
      .getByTestId("tasks-pending-table")
      .getByRole("row", { name: taskName }).getByText(taskName).click();

    await expect(this.page.getByRole("heading", { name: taskName })).toBeVisible();
    await this.page.getByTestId("comments-text-field").fill(comment);
    await this.page.getByTestId("comments-submit-button").click();
    await expect(this.page.getByTestId('task-comment-content')).toHaveText(comment);

    await this.page.getByTestId('navbar-todos-page-link').click();
    await expect(this.page.getByTestId("tasks-pending-table")
      .getByRole('row', { name: taskName })
      .getByRole('cell').nth(3)).toHaveText("1");
  }

  verfiyCommentPersisted = async ({ taskName, comment }: TaskCommentProps) => {
    const taskRow = this.page.getByTestId("tasks-pending-table").getByRole('row', { name: taskName });
    await expect(taskRow.getByRole("cell").nth(3)).toHaveText("1");

    await taskRow.getByText(taskName).click();
    await expect(this.page.getByTestId("task-comment-content")).toHaveText(comment);
  }
}