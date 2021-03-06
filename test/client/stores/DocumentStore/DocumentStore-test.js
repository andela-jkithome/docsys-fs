(function() {
    'use strict';


    var AppDispatcher = require('../../../../app/scripts/dispatcher/AppDispatcher');
    var DocumentStore = require('../../../../app/scripts/stores/DocumentStore');
    var constants = require('../../../../app/scripts/constants/DocsysConstants');
    var sinon = require('sinon');
    var expect = require('chai').expect;

    describe('DocumentStore', function() {
        var registerSpy;

        before(function() {
            // Don't emit the change in the tests
            sinon.stub(DocumentStore, 'emitChange', function() {
                return true;
            });
            registerSpy = sinon.stub(AppDispatcher, 'register');
            sinon.spy(AppDispatcher, 'dispatch');
            registerSpy.onFirstCall().returnsArg(0);
        });

        after(function() {
            AppDispatcher.dispatch.restore();
            AppDispatcher.register.restore();
            registerSpy.restore();
        });

        it('adds all fetched documents', function() {
            sinon.spy(DocumentStore, 'setDocuments');
            var DocumentAction = {
                actionType: constants.DOCUMENTS_GET,
                data: [{ id: 1 }, { id: 2 }]
            };
            AppDispatcher.dispatch(DocumentAction);

            expect(DocumentStore.setDocuments.called).to.eql(true);
            var documents = DocumentStore.getDocuments();
            expect(documents).to.eql(DocumentAction.data);
        });

        it('adds a fetched document', function() {
            sinon.spy(DocumentStore, 'setDocument');
            var DocumentAction = {
                actionType: constants.DOCUMENT_GET,
                data: { id: 1 }
            };
            AppDispatcher.dispatch(DocumentAction);

            expect(DocumentStore.setDocument.called).to.eql(true);
            var document = DocumentStore.getDocument();
            expect(document).to.eql(DocumentAction.data);
        });

        it('adds a created document', function() {
            sinon.spy(DocumentStore, 'setCreatedDocument');
            var documentAction = {
                actionType: constants.DOCUMENT_CREATE,
                data: { id: 1 }
            };
            AppDispatcher.dispatch(documentAction);

            expect(DocumentStore.setCreatedDocument.called).to.eql(true);
            var document = DocumentStore.getCreatedDocument();
            expect(document).to.eql(documentAction.data);
        });

        it('adds an edited document', function() {
            sinon.spy(DocumentStore, 'setEditedDocument');
            var documentAction = {
                actionType: constants.DOCUMENT_EDIT,
                data: { id: 1 }
            };
            AppDispatcher.dispatch(documentAction);

            expect(DocumentStore.setEditedDocument.called).to.eql(true);
            var document = DocumentStore.getEditedDocument();
            expect(document).to.eql(documentAction.data);
        });

        it('adds a deleted document', function() {
            sinon.spy(DocumentStore, 'setDeletedDocument');
            var documentAction = {
                actionType: constants.DOCUMENT_DELETE,
                data: { id: 1 }
            };
            AppDispatcher.dispatch(documentAction);

            expect(DocumentStore.setDeletedDocument.called).to.eql(true);
            var document = DocumentStore.getDeletedDocument();
            expect(document).to.eql(documentAction.data);
        });

        it('adds user documents', function() {
            sinon.spy(DocumentStore, 'setUserDocuments');
            var documentAction = {
                actionType: constants.USERDOCUMENTS_GET,
                data: [{ id: 1 }, { id: 2 }]
            };
            AppDispatcher.dispatch(documentAction);

            expect(DocumentStore.setUserDocuments.called).to.eql(true);
            var documents = DocumentStore.getUserDocuments();
            expect(documents).to.eql(documentAction.data);
        });

        it('adds searched documents by genre,title or date', function() {
            sinon.spy(DocumentStore, 'setSearchedDocuments');
            var documentAction = {
                actionType: constants.DOCUMENT_SEARCH,
                data: [{ id: 1 }, { id: 2 }]
            };
            AppDispatcher.dispatch(documentAction);

            expect(DocumentStore.setSearchedDocuments.called).to.eql(true);
            var documents = DocumentStore.getSearchedDocuments();
            expect(documents).to.eql(documentAction.data);
        });

        it('adds documents accessible by a user', function() {
            sinon.spy(DocumentStore, 'setByUserDocuments');
            var documentAction = {
                actionType: constants.USERACCESSDOCUMENTS_GET,
                data: [{ id: 1 }, { id: 2 }]
            };
            AppDispatcher.dispatch(documentAction);

            expect(DocumentStore.setByUserDocuments.called).to.eql(true);
            var documents = DocumentStore.getSearchedDocuments();
            expect(documents).to.eql(documentAction.data);
        });
    })

})();
