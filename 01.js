
function solution(angle) {
    if (angle === 180) return 4;
    if (angle < 90) return 1;
    if (angle === 90) return 2;
    if (angle <180) return 3;
}
console.log(solution(80));
console.log(solution(90));
console.log(solution(110));
console.log(solution(180));