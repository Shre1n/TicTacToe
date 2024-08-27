export class Semaphore {
  private task: (() => void)[] = [];
  private available: number;

  constructor(count: number) {
    this.available = count;
  }

  async acquire(): Promise<void> {
    if (this.available > 0) {
      this.available--;
      return;
    }
    return new Promise<void>((resolve) => {
      this.task.push(resolve);
    });
  }

  release() {
    this.available++;
    if (this.available > 0) {
      const nextTask = this.task.shift();
      if (nextTask) {
        this.available--;
        nextTask();
      }
    }
  }
}
