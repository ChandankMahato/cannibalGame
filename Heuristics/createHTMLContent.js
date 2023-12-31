function createHtmlContent(data){
    return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>State Space Tree Visualization</title>
    <script type="text/javascript" src="https://unpkg.com/vis-network@7.7.0/dist/vis-network.min.js"></script>

     <style>
        html,
        body {
            height: 100%;
            margin: 0;
            overflow: hidden;
        }

        #mctree {
            width: 100%;
            height: 100vh;
        }

        .legend {
            position: fixed;
            left: 40%;
            margin-bottom: 60px;
        }

        .legend-item {
            display: flex;
        }

        .circle {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            margin-right: 20px;
        }

        .legend-text {
            margin: 0;
            font-size: 30px;
        }

        #header {
            text-align: center;
            background: #fefefe;
            color: #000000;
            margin: 0;
        }
    </style>
</head>

<body>
     <div id="header">
        <h1 class="top-text">8 Puzzle Game State Space Tree Using Missing Element.</h1>
        <div class="legend">
            <div class="legend-item">
                <div class="circle" style="background-color: green;"></div>
                <p class="legend-text">Solution Path</p>
            </div>
            <div class="legend-item">
                <div class="circle" style="background-color: red;"></div>
                <p class="legend-text">Killed Node</p>
            </div>
        </div>
    </div>
    <div id="mctree"></div>
    <script type="text/javascript" src="https://unpkg.com/vis-network@7.7.0/dist/vis-network.min.js"></script>
    <script>
        var nodes = null;
        var edges = null;
        var network = null;
        var data = ${ JSON.stringify(data, null, 2)};
        var container = document.getElementById('mctree');
        var options = {
            layout: {
                hierarchical: {
                    direction: 'UD',
                    sortMethod: 'directed',
                    levelSeparation: 90,
                    nodeSpacing: 180,
                }
            },
            physics: {
                enabled: false
            },

        };
        var network = new vis.Network(container, data, options);
    </script>
</body>

</html>`
}

module.exports = {
    createHtmlContent
}