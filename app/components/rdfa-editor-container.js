import Component from '@ember/component';
import Scanner from '@lblod/ember-rdfa-editor/utils/rdfa-context-scanner';
import NodeWalker from '@lblod/ember-contenteditable-editor/utils/node-walker';
import Vis from 'vis';

export default Component.extend({
  rdfaEditorContainerReady: false,
  classNames: ['container-flex--contain'],

  setRdfaContext(element){
    element.setAttribute('vocab', JSON.parse(this.get('editorDocument.context'))['vocab']);
    element.setAttribute('prefix', this.prefixToAttrString(JSON.parse(this.get('editorDocument.context'))['prefix']));
    element.setAttribute('typeof', 'foaf:Document');
    element.setAttribute('resource', '#');
  },

  prefixToAttrString(prefix){
    let attrString = '';
    Object.keys(prefix).forEach(key => {
      let uri = prefix[key];
      attrString += `${key}: ${uri} `;
    });
    return attrString;
  },

  didInsertElement() {
    this._super(...arguments);
    this.setRdfaContext(this.element);
    this.set('rdfaEditorContainerReady', true);
  },

  actions: {
    handleRdfaEditorInit(editor){
      this.rdfaEditorContainerInit(editor);
    },
    launchItAll(visualizeStructure){
      const fixedY = visualizeStructure;
      const element = this.element;
      const scanner = Scanner.create();

      // START theft from rdfa-context-scanner
      const nodeWalker = NodeWalker.create();
      const richNode = nodeWalker.processDomNode(element);

      scanner.enrichRichNodeWithRdfa(richNode);

      const rootRdfa = scanner.calculateRdfaToTop(richNode);
      scanner.expandRdfaContext(richNode, rootRdfa.context, rootRdfa.prefixes);
      // END theft from rdfa-context-scanner

      const richNodeClientRect = function(richNode) {
        try {
          return richNode.domNode.parentElement.getBoundingClientRect();
        } catch (e) {
          return null;
        }
      };

      const interestingNodes = [];
      const fillInterestingNodes = function( richNode ) {
        if( richNode.rdfaAttributes
            && ! scanner.isEmptyRdfaAttributes( richNode.rdfaAttributes ) ) {
          interestingNodes.push( richNode );
        }

        (richNode.children || []).map( fillInterestingNodes );
      };
      fillInterestingNodes( richNode );


      const visNodes = [];
      const visEdges = [];
      const findNodeById = function( identifier ) {
        return visNodes.findBy("id", identifier);
      };

      const pushNode = function( resource, node ) {
        if( !visNodes.findBy("id", resource) ) {
          const clientRectangle = richNodeClientRect( node );
          visNodes.push( {
            id: resource,
            label: resource,
            fixed: { y: fixedY },
            x: clientRectangle.x,
            y: clientRectangle.y
          } );
        }
      };

      const pushEdge = function( source, target, name ) {
        visEdges.push( {
          label: name,
          from: source,
          to: target,
          arrows: "to"
        } );
      };

      interestingNodes.forEach( function( node ) {
        if( node.rdfaContext.length >= 2 ) {
          const subject = node.rdfaContext[node.rdfaContext.length-2].resource;
          const object = node.rdfaContext[node.rdfaContext.length-1].resource;
          const predicate = node.rdfaContext[node.rdfaContext.length-1].property;

          pushNode( object, node );
          pushEdge( subject, object, predicate );
        } else if( node.rdfaContext[0].resource ) {
          const ctx = node.rdfaContext[0];
          if( !visNodes.findBy("id", ctx.resource) ) {
            pushNode( ctx.resource, node );
          }
        }

      });

      // const rectangles = scannedElements.map( function(node, idx) {
      //   const result = richNodeClientRect( node.richNode );
      //   if (result) {
      //     return result;
      //   } else {
      //     console.log(`Could not get rectangle for ${idx} :: ${node}`);
      //     return null;
      //   }
      // } );

      // const makeNodeFromRichNode = function(richNode) {
      //   let rect = richNodeClientRect(richNode);
      //   if( rect ) {
      //     const clientRect = richNodeClientRect( richNode );
      //     const lastContext = richNode.contexts[richNode.contexts.length - 1];

      //     const label = if( lastContext.

      //     return {
      //       x: clientRect.x,
      //       y: clientRect.y,
      //     };
      //   }
      // };

      const editorNode = element.getElementsByClassName("rdfa-editor")[0];
      const editorSize = editorNode.getBoundingClientRect();

      const nodes = new Vis.DataSet( visNodes );
      const edges = new Vis.DataSet( visEdges );
      var container = document.getElementById('mynetwork');
      var data = {
        nodes: nodes,
        edges: edges
      };
      var options = {
        height: "100%",
        width: "100%",
        layout: {
          improvedLayout: false,
          randomSeed: 751154,
          /* enabled: false, */
          /* nodespacing: 100 */
        },
        edges: {
          arrows: { to: true },
          smooth: {
            type: "continuous",
            forceDirection: "none",
            roundness: 0.1
          }
        },
        "physics": {
          "barnesHut": {
            "gravitationalConstant": -10650,
            "centralGravity": 0.7,
            "springLength": 50,
            "springConstant": 0.02,
            "damping": 0.85,
            "avoidOverlap": 0.75
          },
          "adaptiveTimestep": true,
          "minVelocity": 0.75,
          "maxVelocity": 100,
          "timestep": 0.4
        }
      };

      const editorPaperNode = editorNode.getElementsByClassName("col--5-12")[0].getElementsByClassName("container-flex--scroll")[0];
//      editorPaperNode.style="position: relative;";
      editorPaperNode.innerHTML = '';
      const visNode = editorPaperNode.appendChild( document.createElement("div") );
      visNode.classList.add("vis-renderer");
      visNode.style=`position: absolute; left: 0; right: 0; top: 0; bottom: 0`;

      var network = new Vis.Network(visNode, data, options);
    }
  }

});
