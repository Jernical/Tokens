class Board {
    constructor(tet, tetNext) {
        this.tet = tet;
        this.tetNext = tetNext;
        this.init();
    }

    init() {
        // Calculate size of canvas from constants.
        this.tet.canvas.width = COLS * BLOCK_SIZE;
        this.tet.canvas.height = ROWS * BLOCK_SIZE;

        // Scale so we don't need to give size on every draw.
        this.tet.scale(BLOCK_SIZE, BLOCK_SIZE);
    }

    reset() {
        this.grid = this.getEmptyGrid();
        this.piece = new Piece(this.tet);
        this.piece.setStartingPosition();
        this.getNewPiece();
    }

    getNewPiece() {
        const { width, height } = this.tetNext.canvas;
        this.next = new Piece(this.tetNext);
        this.tetNext.clearRect(0, 0, width, height);
        this.next.draw();
    }

    draw() {
        this.piece.draw();
        this.drawBoard();
    }

    drop() {
        let q = moves[KEY.DOWN](this.piece);
        if (this.valid(q)) {
            this.piece.move(q);
        } else {
            this.freeze();
            this.clearLines();
            if (this.piece.y === 0) {
                // Game over
                return false;
            }
            this.piece = this.next;
            this.piece.tet = this.tet;
            this.piece.setStartingPosition();
            this.getNewPiece();
        }
        return true
    }

    clearLines() {
        let lines = 0;

        this.grid.forEach((row, o) => {
            // If every value is greater than zero then we have a full row.
            if(row.every((value) => value > 0)) {
                lines++;

                // Remove the row
                this.grid.splice(o, 1);

                // Add 0 filled row at the top
                this.grid.unshift(Array(COLS).fill(0));
            }
        });

        if (lines > 0) {
            // Calculate points from cleared lines and level

            account.score += this.getLinesClearedPoints(lines);
            account.lines += lines;
            
            // if we have reached the lines for next level
            if (account.lines >= LINES_PER_LEVEL) {
                // Goto next level
                account.level++;

                // Remove lines so we start working for the next level
                account.lines -= LINES_PER_LEVEL;

                // Increase spped of game
                time.level = LEVEL[account.level];
            }
        }
    }

    valid(p) {
        return p.shape.every((row, dy) => {
            return row.every((value, dx) => {
                let x = p.x + dx;
                let y = p.y + dy;
                return value === 0 || (this.isInsideWalls(x,y) && this.notOccupied(x, y));
            });
        });
    }

    freeze() {
        this.piece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.grid[y + this.piece.y][x + this.piece.x] = value;
                }
            });
        });
    }

    drawBoard() {
        this.grid.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.tet.fillStyle = COLORS[value];
                    this.tet.fillRect(x, y, 1, 1);
                }
            });
        });
    }

    getEmptyGrid() {
        return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    }

    isInsideWalls(x, y) {
        return x >= 0 && x < COLS && y <= ROWS;
    }

    notOccupied(x, y) {
        return this.grid[y] && this.grid[y][x] === 0;
    }

    rotate(piece, direction) {
        // Clone with JSON for immutabibility
        let p = JSON.parse(JSON.stringify(piece));
        if (!piece.hardDropped) {
            // Transpose matrix
            for (let f = 0; f < p.shape.length; ++f) {
                for (let x = 0; x < f; ++x) {
                    [p.shape[x][f], p.shape[f][x] = [p.shape[f][x], p.shape[x][f]]];
                }
            }
            // Reverse the order of the columns.
            if (direction === ROTATION.RIGHT) {
                p.shape.forEach((row) => row.reverse());
            } else if (direction === ROTATION.LEFT) {
                p.shape.reverse();
            }
        }
        
        return p;
    }

    getLinesClearedPoints(lines, level) {
        const lineClearPoints =
            lines === 1
                ? POINTS.SINGLE
                : lines === 2
                ? POINTS.DOUBLE
                : lines === 3
                ? POINTS.TRIPLE
                : lines === 4
                ? POINTS.TETRIS
                : 0;
            pointsSound.play();
            return (account.level + 1) * lineClearPoints;
    }
}