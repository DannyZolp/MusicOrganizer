export const AddToQRQueue = (scoreId: string) => {
    window.localStorage.setItem("print_qrcodes", JSON.stringify([
        ...JSON.parse(window.localStorage.getItem("print_qrcodes") ?? "[]"),
        scoreId,
      ]));
}

export const RemoveFromQRQueue = (scoreId: string) => {
    let queue =  JSON.parse(window.localStorage.getItem("print_qrcodes") ?? "[]") as string[];
    if (queue.findIndex(q => q === scoreId) >= 0) {
        queue.splice(queue.findIndex(q => q === scoreId), 1);
        window.localStorage.setItem("print_qrcodes", JSON.stringify(queue));
    }
}

export const IsInQRQueue = (scoreId: string) => {
    const queue = JSON.parse(window.localStorage.getItem("print_qrcodes") ?? "[]") as string[];
    return queue.includes(scoreId);
}