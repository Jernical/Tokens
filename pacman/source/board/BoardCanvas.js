/**
 * @extends {Canvas}
 * The Board Canvas Class
 */
class BoardCanvas extends Canvas {
    
    /**
     * The Board Canvas constructor
     */
    constructor() {
        super();
        
        this.init("board");
        
        this.ctx.lineWidth   = Board.lineWidth;
        this.ctx.strokeStyle = Board.boardColor;
        
        
        this.drawTShapes = {
            "down"  : { radians: 0,   x:  0, y:  0 },
            "left"  : { radians: 0.5, x:  0, y: -5 },
            "right" : { radians: 1.5, x: -1, y:  0 },
            "up"    : { radians: 1,   x: -1, y: -5 }
        };
        this.radians = {
            "top-left"     : { from:   1, to: 1.5 },
            "top-right"    : { from: 1.5, to:   2 },
            "bottom-right" : { from:   0, to: 0.5 },
            "bottom-left"  : { from: 0.5, to:   1 }
        };
        this.corners = {
            "top-left"     : { x:  1, y:  1 },
            "top-right"    : { x: -1, y:  1 },
            "bottom-right" : { x: -1, y: -1 },
            "bottom-left"  : { x:  1, y: -1 }
        };
        this.smallCorners = {
            "top-left" : {
                x : { cell: 1, line: -1 },
                y : { cell: 1, line: -1 }
            },
            "top-right" : {
                x : { cell: 0, line:  1 },
                y : { cell: 1, line: -1 }
            },
            "bottom-right" : {
                x : { cell: 0, line:  1 },
                y : { cell: 0, line:  1 }
            },
            "bottom-left" : {
                x : { cell: 1, line: -1 },
                y : { cell: 0, line:  1 }
            }
        };
    }

     /**
     * Draw the Board
     * @param {boolean} newLevel
     */
    drawBoard(newLevel) {
        this.drawGhostsPen();
        
        this.ctx.save();
        this.ctx.strokeStyle = newLevel ? "white" : Board.boardColor;
        this.drawOuterBorder();
        this.drawInnerBorder();
        
        // First Row
        this.drawRectangle(2,  2,  4, 3);
        this.drawRectangle(7,  2,  5, 3);
        this.drawRectangle(16, 2,  5, 3);
        this.drawRectangle(22, 2,  4, 3);
        
        // Second Row
        this.drawRectangle(2,  6, 4, 2);
        this.drawTShape(7,     6, 4, 4, "right");
        this.drawTShape(10,    6, 4, 4, "down");
        this.drawTShape(16,    6, 4, 4, "left");
        this.drawRectangle(22, 6, 4, 2);
        
        // Third Row
        this.drawRectangle(7,  15, 2, 5);
        this.drawTShape(10,    18, 4, 4, "down");
        this.drawRectangle(19, 15, 2, 5);
        
        // Fourth Row
        this.drawLShape(2,     21, false);
        this.drawRectangle(7,  21, 5, 2);
        this.drawRectangle(16, 21, 5, 2);
        this.drawLShape(22,    21, true);
        
        // Fith Row
        this.drawTShape(2,  24, 4, 6, "up");
        this.drawTShape(10, 24, 4, 4, "down");
        this.drawTShape(16, 24, 6, 4, "up");
        
        this.ctx.restore();
    }
   
    /**
     * Draws the Ghosts Pen House
     */
    drawGhostsPen() {
        this.ctx.strokeRect(10.5 * Board.tileSize,                  12.5 * Board.tileSize,                  7 * Board.tileSize,                   4 * Board.tileSize);
        this.ctx.strokeRect(11   * Board.tileSize - Board.halfLine, 13   * Board.tileSize - Board.halfLine, 6 * Board.tileSize + Board.lineWidth, 3 * Board.tileSize + Board.lineWidth);
        this.ctx.strokeRect(13   * Board.tileSize - Board.halfLine, 12.5 * Board.tileSize,                  2 * Board.tileSize + Board.lineWidth, Board.tileSize / 2 - Board.halfLine);
        this.ctx.clearRect(13    * Board.tileSize,                  12.5 * Board.tileSize - Board.halfLine, 2 * Board.tileSize,                   Board.tileSize / 2 + Board.halfLine);
        
        this.ctx.save();
        this.ctx.strokeStyle = "white";
        this.ctx.strokeRect(13   * Board.tileSize + Board.halfLine, 12.5 * Board.tileSize + Board.lineWidth, 2 * Board.tileSize - Board.lineWidth, Board.halfLine);
        this.ctx.restore();
    }
    
    /**
     * Draws the Board outer border
     */
    drawOuterBorder() {
        this.ctx.beginPath();
        
        // Top Corners
        this.drawOuterBigCorner(0,  0, "top-left");
        this.drawOuterBigCorner(27, 0, "top-right");
        
        // Right Tunnel
        this.drawOuterBigCorner(27,    9, "bottom-right");
        this.drawOuterSmallCorner(22,  9, "top-left");
        this.drawOuterSmallCorner(22, 13, "bottom-left");
        this.ctx.lineTo(28 * Board.tileSize, 13 * Board.tileSize + Board.halfLine);
        this.ctx.moveTo(28 * Board.tileSize, 16 * Board.tileSize - Board.halfLine);
        this.drawOuterSmallCorner(22, 15, "top-left");
        this.drawOuterSmallCorner(22, 19, "bottom-left");
        this.drawOuterBigCorner(27,   19, "top-right");
        
        // Bottom Corners
        this.drawOuterBigCorner(27,   30, "bottom-right");
        this.drawOuterBigCorner(0,    30, "bottom-left");
        
        // Left Tunnel
        this.drawOuterBigCorner(0,    19, "top-left");
        this.drawOuterSmallCorner(5,  19, "bottom-right");
        this.drawOuterSmallCorner(5,  15, "top-right");
        this.ctx.lineTo(0, 16 * Board.tileSize - Board.halfLine);
        this.ctx.moveTo(0, 13 * Board.tileSize + Board.halfLine);
        this.drawOuterSmallCorner(5,  13, "bottom-right");
        this.drawOuterSmallCorner(5,   9, "top-right");
        this.drawOuterBigCorner(0,     9, "bottom-left");
        
        this.ctx.lineTo(Board.halfLine, Board.bigRadius + Board.halfLine);
        this.ctx.stroke();
    }
    