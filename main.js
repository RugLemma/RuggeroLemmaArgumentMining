$(document).ready(function () {

    $(document).on("click", "#grafo .node", function () {
        var nodeId = Number($(this).find('.nodo').attr('id'));
        $('.nodo').css({stroke: 'rgb(51, 51, 51)'});
        $(this).find('.nodo').css({stroke: "#ff5bbd"});
    });
    
    $(document).mousemove(function (e) {
        let pos = {top: e.pageY + 10, left: e.pageX + 10};
        $('#descriptionMouse').offset(pos);
    });

    $(document).on({
        mouseenter: function () {
            var nodeId = Number($(this).find('.nodo').attr('id'));
            $('#descriptionMouse').text(datagraph.node.get(nodeId).text);
        },
        mouseleave: function () {
            $('#descriptionMouse').text("");
        }
    }, "#grafo .node");

    $(document).on("click", "#grafo2 .node", function () {
            $('#grafo2 .g2-node').css({stroke: 'rgb(51, 51, 51)'});
            $(this).find('.g2-node').css({stroke: "#ff5bbd"});
        }
    );

    $(document).on({
        mouseenter: function () {
            let nodeId = $(this).find('.g2-node').attr('id');
            nodeId = Number(nodeId.substring(3));
            $('#descriptionMouse').text(grafo_tema.node.get(nodeId).text);
        },
        mouseleave: function () {
            $('#descriptionMouse').text("");
        }
    }, "#grafo2 .node");

});

for (let i = 1; i < 91; i++){
    if(i < 10){
        $("#arguments").append('<button class="essay" type="button">essay0' + i + '</button>');
    }
    else{
        $("#arguments").append('<button class="essay" type="button">essay' + i + '</button>');
    }

}


//Dataset 1: Debatepedia and ProCon

let datagraph;

function caricaArgomento(argomento) {
    datagraph = new jsnx.DiGraph();
    $.getJSON('json_files/' + argomento + '.json', function (data) {
        datagraph.graph = data.graph.topic;
        $("#grafo-topic").text(String(datagraph.graph));
        for (nodo of data.nodes) {
            datagraph.addNode(Number(nodo.id), {text: nodo.text, label: nodo.text.substring(0, 10)});
        }
        for (edge of data.links) {
            if (edge.entailment === 1) {
                datagraph.addEdge(Number(edge.source), Number(edge.target), {color: 'orange'});
            } else {
                datagraph.addEdge(Number(edge.source), Number(edge.target), {color: 'black'});
            }
        }
        jsnx.draw(datagraph, {
            element: '#grafo',
            layoutAttr: {
                linkDistance: 100
            },
            withLabels: true,
            edgeStyle: {
                fill: function (d) {
                    return d.data.color
                }
            },
            nodeStyle: {
                fill: '#d2e0f7'
            },
            nodeAttr: {
                r: 15,
                id: function (d) {
                    return d.node; // give an unique ID
                },
                class: function (d) {
                    return 'nodo';
                }
            }
        });

    });
}

caricaArgomento('Abortion'); //it loads the dafault topic 

$('.topic').click(function () { //it changes the topic of the Dataset1 
    $(".nodo").remove();
    caricaArgomento($(this).text());
});

//Dataset 3: Annotated Speeches
let CameronRighe = [];
let CameronEtichette = [];
let CleggRighe = [];
let CleggEtichette = [];
let MilibandRighe = [];
let MilibandEtichette = [];

$("#discorso1").click(function () {
    discorso(1);
});
$("#discorso2").click(function () {
    discorso(2);
});
$("#discorso3").click(function () {
    discorso(3);
});

$("#pulisci").click(function () {
    $('#discorso_sottolineato').empty();
});


//Here I take the different speech
$.get('speeches/Cameron.txt', function (data) {
    CameronRighe = data.split("\n");
}, 'text');
$.get('speeches/CameronLabels.txt', function (data) {
    CameronEtichette = data.split("\n");

}, 'text');
$.get('speeches/Clegg.txt', function (data) {
    CleggRighe = data.split("\n");
}, 'text');
$.get('speeches/CleggLabels.txt', function (data) {
    CleggEtichette = data.split("\n");

}, 'text');
$.get('speeches/Miliband.txt', function (data) {
    MilibandRighe = data.split("\n");
}, 'text');
$.get('speeches/MilibandLabels.txt', function (data) {
    MilibandEtichette = data.split("\n");

}, 'text');

function discorso(numDiscorso) {
    let righe = [];
    let etichette = [];
    switch (numDiscorso) {
        case 1:
            righe = CameronRighe;
            etichette = CameronEtichette;
            break;
        case 2:
            righe = CleggRighe;
            etichette = CleggEtichette;
            break;
        case 3:
            righe = MilibandRighe;
            etichette = MilibandEtichette;
            break;
    }


    let discorso_html = "";
    for (let i = 0; i < righe.length; i++) {
        if (i < 9) {
            if (etichette[i] === 'C') {
                discorso_html += '<span style="background-color: yellow" >' + righe[i].substring(1) + '</span>';
            }
            discorso_html += righe[i].substring(1);
        }
        else if (i < 99) {
            if (etichette[i] === 'C') {
                discorso_html += '<span  style="background-color: yellow" >' + righe[i].substring(2) + '</span>';
            }
            discorso_html += righe[i].substring(2);
        }
        else if (i < 999) {
            if (etichette[i] === 'C') {
                discorso_html += '<span  style="background-color: yellow" >' + righe[i].substring(3) + '</span>';
            }
            discorso_html += righe[i].substring(3);
        }

    }
    $('#discorso_sottolineato').empty();
    $('#discorso_sottolineato').append(discorso_html);


}


//Dataset 2: Annotated Essays
let tema_testo = "";
let punti = [];

$('.essay').click(function () {
    $(".g2-node").remove();
    $("#annotated-text").empty();
    //$('#desc-2').text("");
    caricaTema($(this).text());
});

let grafo_tema;

function caricaTema(numTema) {
    grafo_tema = new jsnx.DiGraph();
    tema_testo = "";
    punti = [];
    $("#grafo-essay").text(String(numTema));
    $.getJSON('json_files_2/' + numTema + '_.json', function (data) {

        $.get('essay_texts/' + numTema + '.txt', function (data) {
            tema_testo = data;
        }, 'text');
        
        grafo_tema.graph = data.graph.topic;
        for (node of data.nodes) {
            punti.push({entity: node.entity, start: Number(node.start), end: Number(node.end), id: node.id});

            if (node.entity === 'MajorClaim') {
                grafo_tema.addNode(node.id, {
                    text: node.text,
                    end: node.end,
                    start: node.start,
                    color: 'red',
                    radius: 30
                });
            }
            if (node.entity === 'Claim') {
                grafo_tema.addNode(node.id, {
                    text: node.text,
                    end: node.end,
                    start: node.start,
                    color: 'yellow',
                    radius: 15
                });
            }
            if (node.entity === 'Premise') {
                grafo_tema.addNode(node.id, {
                    text: node.text,
                    end: node.end,
                    start: node.start,
                    color: 'lawngreen',
                    radius: 10
                });
            }

        }
        for (edge of data.links) {
            if (edge.entailment === 1) {
                grafo_tema.addEdge(edge.source, edge.target, {color: 'orange'});
            } else {
                grafo_tema.addEdge(edge.source, edge.target, {color: 'black'});
            }

        }

        jsnx.draw(grafo_tema, {
            element: '#grafo2',
            layoutAttr: {
                linkDistance: 150
            },
            withLabels: true,
            edgeStyle: {
                fill: function (d) {
                    return d.data.color;
                }
            },
            nodeStyle: {
                fill: function (d) {
                    return d.data.color;
                }
            },
            nodeAttr: {
                r: function (d) {
                    return d.data.radius;
                },
                id: function (d) {
                    return 'G2-' + d.node; // assign unique ID
                },
                class: 'g2-node'
            }


        });
    });


}

caricaTema('essay01'); //default graph for the second exercise

function tema_sottolineato(essay_original, punti) {
    let essay_html = "";
    let ind = 0;
    let temp = "";
    let color = "";
    punti.sort(function (a, b) {
        return a.start - b.start;
    });
    for (let i = 0; i < punti.length; i++) {
        essay_html += essay_original.substring(ind, punti[i].start);
        if (punti[i].entity === "MajorClaim") {
            color = 'red'
        }
        if (punti[i].entity === "Claim") {
            color = 'yellow'
        }
        if (punti[i].entity === "Premise") {
            color = 'lawngreen'
        }
        temp = '<span style="background-color: ' + color + '" id="text-part-' + punti[i].id + '">'
            + essay_original.substring(punti[i].start, punti[i].end) + "</span>";
        essay_html += temp;
        ind = punti[i].end + 1;
    }
    essay_html += essay_original.substring(ind);

    $('#annotated-text').html(essay_html);

}

$("#reload-text").click(function () {
    $('#annotated-text').empty();
    tema_sottolineato(tema_testo, punti);
});


