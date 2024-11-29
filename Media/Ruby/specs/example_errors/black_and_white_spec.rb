# frozen_string_literal: true

require './lib/basics'
require './lib/schema'
require './lib/table'
require './lib/table_encoder'
require './lib/type_extensions'

# rubocop:disable RSpec/DescribeClass
# rubocop:disable Metrics/BlockLength

# task: The programmer was asked to build a column that indicates whether "a participant consumed
#       lack jelly beans and white ones".
RSpec.describe 'black and white' do
  include Basics

  describe 'handles error as expected' do
    # jellyAnon: a jelly bean table that contains only boolean data
    let(:raw_table_string) do
      "
      # | get acne | red   | black | white | green | yellow | brown | orange | pink  | purple |
      # | -------- | ----- | ----- | ----- | ----- | ------ | ----- | ------ | ----- | ------ |
      # | true     | false | false | false | true  | false  | false | true   | false | false  |
      # | true     | false | true  | false | true  | true   | false | false  | false | false  |
      # | false    | false | false | false | true  | false  | false | false  | true  | false  |
      # | false    | false | false | false | false | true   | false | false  | false | false  |
      # | false    | false | false | false | false | true   | false | false  | true  | false  |
      # | true     | false | true  | false | false | false  | false | true   | true  | false  |
      # | false    | false | true  | false | false | false  | false | false  | true  | false  |
      # | true     | false | false | false | false | false  | true  | true   | false | false  |
      # | true     | false | false | false | false | false  | false | true   | false | false  |
      # | false    | true  | false | false | false | true   | true  | false  | true  | false  |
      "
    end

    let(:table) { TableEncoder.encode(raw_table_string) }

    context 'when happy path' do
      context 'when correct program' do
        # > eatBlackAndWhite =
        #     function(r):
        #       getValue(r, "black") and getValue(r, "white")
        #     end
        # > buildColumn(jellyAnon, "eat black and white", eatBlackAndWhite)
        let(:eat_black_and_white) do
          lambda do |r|
            get_value(r, 'black') && get_value(r, 'white')
          end
        end

        it 'successfully builds the column' do
          new_table = Table.build_column(table, { column_name: 'eat black and white', sort: Boolean }) do |r|
            eat_black_and_white.call(r)
          end

          expect(new_table.nrows).to eq(table.nrows)
          expect(new_table.ncols).to eq(table.ncols + 1)
          expect(new_table.get_column_by_name('eat black and white')).to eq([
                                                                              false,
                                                                              false,
                                                                              false,
                                                                              false,
                                                                              false,
                                                                              false,
                                                                              false,
                                                                              false,
                                                                              false,
                                                                              false
                                                                            ])
        end
      end
    end

    context 'when buggy program' do
      # > eatBlackAndWhite =
      #     function(r):
      #       getValue(r, "black and white") == true
      #     end
      # > buildColumn(jellyAnon, "eat black and white", eatBlackAndWhite)
      let(:eat_black_and_white) do
        lambda do |r|
          # OMG this is the method I needed in the row parsing debauchery
          get_value(r, 'black and white')
        end
      end

      it 'fails since it access an invalid column' do
        expect do
          Table.build_column(table, { column_name: 'eat black and white', sort: Boolean }) do |r|
            eat_black_and_white.call(r)
          end
        end.to raise_error(RequireException)
      end
    end
  end
end
# rubocop:enable RSpec/DescribeClass
# rubocop:enable Metrics/BlockLength
