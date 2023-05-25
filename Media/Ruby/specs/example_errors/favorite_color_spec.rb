# frozen_string_literal: true

require './lib/basics'
require './lib/schema'
require './lib/table'
require './lib/table_encoder'
require './lib/type_extensions'

# rubocop:disable RSpec/DescribeClass
# rubocop:disable Metrics/BlockLength

# students: a simple table with no values missing
RSpec.describe 'favorite color' do
  include Basics

  describe 'handles error as expected' do
    let(:raw_table_string) do
      "
      # | name    | age | favorite color |
      # | ------- | --- | -------------- |
      # | \"Bob\"   | 12  | \"blue\"         |
      # | \"Alice\" | 17  | \"green\"        |
      # | \"Eve\"   | 13  | \"red\"          |
      "
    end

    let(:table) { TableEncoder.encode(raw_table_string) }

    context 'when happy path' do
      context 'when correct program' do
        # > participantsLikeGreen =
        # function(t):
        #   tfilter(t,
        #     function(r):
        #       getValue(r, "favorite color") == "green"
        #     end)
        # end
        let(:participants_like_green) do
          lambda do |t|
            Table.tfilter(t) do |r|
              get_value(r, 'favorite color') == '"green"'
            end
          end
        end

        it 'returns the correct number of participants who like green' do
          result = participants_like_green.call(table)

          expect(result.nrows).to eq(1)
          expect(result.ncols).to eq(3)
          expect(result.get_column_by_name('name')).to eq(['"Alice"'])
          expect(result.get_column_by_name('age')).to eq([17])
        end
      end
    end

    context 'when buggy program' do
      context 'when returning value directly instead of a predicate' do
        # > participantsLikeGreen =
        # function(t):
        #   tfilter(t,
        #     function(r):
        #       getValue(r, "favorite color")
        #     end)
        # end
        let(:participants_like_green) do |_t|
          lambda do |t|
            Table.tfilter(t) do |r|
              get_value(r, 'favorite color')
            end
          end
        end

        it 'fails with require' do
          expect { participants_like_green.call(table) }.to raise_error(RequireException)
        end
      end
    end
  end
end
# rubocop:enable RSpec/DescribeClass
# rubocop:enable Metrics/BlockLength
